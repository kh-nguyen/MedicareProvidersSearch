using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Databases.Medicare;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Transactions;
using System.Windows.Forms;

namespace Import
{
    public partial class Form1 : Form
    {
        private readonly string[] fileTypes = new string[] {
            "NPI",
            "Physicians",
            "Aggregates",
            "Utilization & Payments",
            "Provider of Services - Other",
            "Taxonomy Codes"
        };

        private readonly string[] columnDelimiters = new string[] {
            "Comma {,}", "Tab {t}"
        };

        const string DEFAULT_FILE_FILTER = "CSV files|*.csv|Text files|*.txt";
        const string DEFAULT_FAILED_HEADER_CHECK_RESPONSE = "Failed headers check!, you might have selected the wrong column delimiter.";
        const int DEFAULT_PAUSE_SLEEP_TIME = 1000; // 1 second
        const int MINIMUM_DATA_YEAR = 2000;
        const int MAX_OUTPUT_LINES = 1000;

        private bool interrupt = false;
        private bool pause = false;

        public Form1() {
            InitializeComponent();

            fileTypes.ToList().ForEach(x => comboBoxTypes.Items.Add(x));

            this.SetStyle(
                ControlStyles.AllPaintingInWmPaint |
                ControlStyles.UserPaint |
                ControlStyles.DoubleBuffer, true);

            columnDelimiters.ToList().ForEach(x => comboBoxColumnDelimiters.Items.Add(x));
            comboBoxColumnDelimiters.SelectedIndex = 0;

            textBoxCpuThreads.Text = Environment.ProcessorCount.ToString();

            Reset();
        }

        private void buttonSelect_Click(object sender, EventArgs e) {
            openFileDialog1.Reset();
            openFileDialog1.Filter = DEFAULT_FILE_FILTER;
            if (openFileDialog1.ShowDialog() == System.Windows.Forms.DialogResult.OK) {
                textBoxFile.Text = openFileDialog1.FileName;
            }
        }

        private int getNumberOfWorkers()
        {
            int numberOfWorkers;

            if (!int.TryParse(textBoxCpuThreads.Text, out numberOfWorkers))
                numberOfWorkers = Environment.ProcessorCount;

            return numberOfWorkers;
        }

        private void importData(TextFieldParser parser, Action<string[], int> action)
        {
            var counter = seekToDataLine(parser);

            var totalCount = 0;
            var totalTime = TimeSpan.Zero;

            while (!parser.EndOfData) {
                var batches = new List<string[]>();
                var batchNumber = 0;
                var locker = new object();
                var numberOfWorkers = getNumberOfWorkers();
                var startTime = DateTime.Now;

                // read multiple lines to be processed in parallel
                while (!parser.EndOfData && ++batchNumber <= numberOfWorkers) {
                    batches.Add(parser.ReadFields());
                }

                batches.AsParallel().WithDegreeOfParallelism(numberOfWorkers).ForAll(fields => {
                    //Processing row
                    try {
                        lock (locker) { ++counter; }

                        action?.Invoke(fields, counter);
                    }
                    catch (Exception ex) {
                        Write(ex.ToString());
                    }
                });

                if (totalCount > 1000) {
                    totalCount = 0;
                    totalTime = TimeSpan.Zero;
                }
                totalCount += batches.Count;
                totalTime += DateTime.Now - startTime;
                toolStripStatusLabelProcessingSpeed.Text = string.Format(
                    "{0:0.00} lines / second", totalCount / totalTime.TotalMilliseconds * 1000);

                if (interrupt)
                    break;

                while (pause)
                    Thread.Sleep(DEFAULT_PAUSE_SLEEP_TIME);
            }
        }

        private int seekToDataLine(TextFieldParser parser)
        {
            var skipped = 0;
            var strSkip = textBoxLineNumberStart.Text;

            if (!string.IsNullOrEmpty(strSkip)) {
                skipped = int.Parse(strSkip) - 1;

                for (var i = 0; !parser.EndOfData && i < skipped; ++i) {
                    WriteLine(string.Format("Seeking at {0} to line #{1}...", i, skipped));
                    parser.ReadLine();

                    if (interrupt)
                        break;

                    while (pause)
                        Thread.Sleep(DEFAULT_PAUSE_SLEEP_TIME);
                }
                WriteLine("done");
            }

            return skipped;
        }

        #region NPI

        public void importNPI(string file) {
            using (var parser = new TextFieldParser(file)) {
                parser.TextFieldType = FieldType.Delimited;
                parser.SetDelimiters(getColumnDelimiter());
                parser.HasFieldsEnclosedInQuotes = true;

                // read the headers stored on the first line
                var headers = parser.ReadFields();

                //for (var i = 0; i < headers.Count(); ++i) { WriteLine("if (!string.IsNullOrWhiteSpace(data[{1}])) provider.{0} = data[{1}].Trim();", headers[i].Replace(' ', '_'), i); }

                if (!checkHeadersNPI(headers)) {
                    WriteLine(DEFAULT_FAILED_HEADER_CHECK_RESPONSE);

                    // stop processing
                    return;
                }

                importData(parser, processRowNPI);
            }
        }

        private void processRowNPI(string[] data, int counter) {
            using (var medicareDatabase = new MedicareEntities()) {
                int NPI = 0;

                if (!int.TryParse(data[0], out NPI))
                    return;

                //var provider = new MedicareProvider { NPI = NPI };

                //var exists = medicareDatabase.MedicareProviders.Where(x => x.NPI == NPI).Any();

                //if (!exists) { // new
                //    medicareDatabase.MedicareProviders.Add(provider);
                //} else {
                //    medicareDatabase.MedicareProviders.Attach(provider);
                //    medicareDatabase.Entry(provider).State = System.Data.Entity.EntityState.Modified;
                //}

                var provider = medicareDatabase.MedicareProviders.Find(NPI);

                var exists = provider != null;

                if (!exists) { // new
                    provider = new MedicareProvider { NPI = NPI };
                    medicareDatabase.MedicareProviders.Add(provider);
                }

                if (!string.IsNullOrWhiteSpace(data[1])) provider.Entity_Type_Code = short.Parse(data[1].Trim());
                if (!string.IsNullOrWhiteSpace(data[2])) provider.Replacement_NPI = int.Parse(data[2].Trim());
                if (!string.IsNullOrWhiteSpace(data[3])) provider.Employer_Identification_Number__EIN_ = data[3].Trim();
                if (!string.IsNullOrWhiteSpace(data[4])) provider.Provider_Organization_Name__Legal_Business_Name_ = data[4].Trim();
                if (!string.IsNullOrWhiteSpace(data[5])) provider.Provider_Last_Name__Legal_Name_ = data[5].Trim();
                if (!string.IsNullOrWhiteSpace(data[6])) provider.Provider_First_Name = data[6].Trim();
                if (!string.IsNullOrWhiteSpace(data[7])) provider.Provider_Middle_Name = data[7].Trim();
                if (!string.IsNullOrWhiteSpace(data[8])) provider.Provider_Name_Prefix_Text = data[8].Trim();
                if (!string.IsNullOrWhiteSpace(data[9])) provider.Provider_Name_Suffix_Text = data[9].Trim();
                if (!string.IsNullOrWhiteSpace(data[10])) provider.Provider_Credential_Text = data[10].Trim();
                if (!string.IsNullOrWhiteSpace(data[11])) provider.Provider_Other_Organization_Name = data[11].Trim();
                if (!string.IsNullOrWhiteSpace(data[12])) provider.Provider_Other_Organization_Name_Type_Code = short.Parse(data[12].Trim());
                if (!string.IsNullOrWhiteSpace(data[13])) provider.Provider_Other_Last_Name = data[13].Trim();
                if (!string.IsNullOrWhiteSpace(data[14])) provider.Provider_Other_First_Name = data[14].Trim();
                if (!string.IsNullOrWhiteSpace(data[15])) provider.Provider_Other_Middle_Name = data[15].Trim();
                if (!string.IsNullOrWhiteSpace(data[16])) provider.Provider_Other_Name_Prefix_Text = data[16].Trim();
                if (!string.IsNullOrWhiteSpace(data[17])) provider.Provider_Other_Name_Suffix_Text = data[17].Trim();
                if (!string.IsNullOrWhiteSpace(data[18])) provider.Provider_Other_Credential_Text = data[18].Trim();
                if (!string.IsNullOrWhiteSpace(data[19])) provider.Provider_Other_Last_Name_Type_Code = short.Parse(data[19].Trim());
                if (!string.IsNullOrWhiteSpace(data[20])) provider.Provider_First_Line_Business_Mailing_Address = data[20].Trim();
                if (!string.IsNullOrWhiteSpace(data[21])) provider.Provider_Second_Line_Business_Mailing_Address = data[21].Trim();
                if (!string.IsNullOrWhiteSpace(data[22])) provider.Provider_Business_Mailing_Address_City_Name = data[22].Trim();
                if (!string.IsNullOrWhiteSpace(data[23])) provider.Provider_Business_Mailing_Address_State_Name = data[23].Trim();
                if (!string.IsNullOrWhiteSpace(data[24])) provider.Provider_Business_Mailing_Address_Postal_Code = data[24].Trim();
                if (!string.IsNullOrWhiteSpace(data[25])) provider.Provider_Business_Mailing_Address_Country_Code__If_outside_US_ = data[25].Trim();
                if (!string.IsNullOrWhiteSpace(data[26])) provider.Provider_Business_Mailing_Address_Telephone_Number = data[26].Trim();
                if (!string.IsNullOrWhiteSpace(data[27])) provider.Provider_Business_Mailing_Address_Fax_Number = data[27].Trim();
                if (!string.IsNullOrWhiteSpace(data[28])) provider.Provider_First_Line_Business_Practice_Location_Address = data[28].Trim();
                if (!string.IsNullOrWhiteSpace(data[29])) provider.Provider_Second_Line_Business_Practice_Location_Address = data[29].Trim();
                if (!string.IsNullOrWhiteSpace(data[30])) provider.Provider_Business_Practice_Location_Address_City_Name = data[30].Trim();
                if (!string.IsNullOrWhiteSpace(data[31])) provider.Provider_Business_Practice_Location_Address_State_Name = data[31].Trim();
                if (!string.IsNullOrWhiteSpace(data[32])) provider.Provider_Business_Practice_Location_Address_Postal_Code = data[32].Trim();
                if (!string.IsNullOrWhiteSpace(data[33])) provider.Provider_Business_Practice_Location_Address_Country_Code__If_outside_US_ = data[33].Trim();
                if (!string.IsNullOrWhiteSpace(data[34])) provider.Provider_Business_Practice_Location_Address_Telephone_Number = data[34].Trim();
                if (!string.IsNullOrWhiteSpace(data[35])) provider.Provider_Business_Practice_Location_Address_Fax_Number = data[35].Trim();
                if (!string.IsNullOrWhiteSpace(data[36])) provider.Provider_Enumeration_Date = DateTime.Parse(data[36].Trim());
                if (!string.IsNullOrWhiteSpace(data[37])) provider.Last_Update_Date = DateTime.Parse(data[37].Trim());
                if (!string.IsNullOrWhiteSpace(data[38])) provider.NPI_Deactivation_Reason_Code = data[38].Trim();
                if (!string.IsNullOrWhiteSpace(data[39])) provider.NPI_Deactivation_Date = DateTime.Parse(data[39].Trim());
                if (!string.IsNullOrWhiteSpace(data[40])) provider.NPI_Reactivation_Date = DateTime.Parse(data[40].Trim());
                if (!string.IsNullOrWhiteSpace(data[41])) provider.Provider_Gender_Code = data[41].Trim();
                if (!string.IsNullOrWhiteSpace(data[42])) provider.Authorized_Official_Last_Name = data[42].Trim();
                if (!string.IsNullOrWhiteSpace(data[43])) provider.Authorized_Official_First_Name = data[43].Trim();
                if (!string.IsNullOrWhiteSpace(data[44])) provider.Authorized_Official_Middle_Name = data[44].Trim();
                if (!string.IsNullOrWhiteSpace(data[45])) provider.Authorized_Official_Title_or_Position = data[45].Trim();
                if (!string.IsNullOrWhiteSpace(data[46])) provider.Authorized_Official_Telephone_Number = data[46].Trim();
                if (!string.IsNullOrWhiteSpace(data[47])) provider.Healthcare_Provider_Taxonomy_Code_1 = data[47].Trim();
                if (!string.IsNullOrWhiteSpace(data[48])) provider.Provider_License_Number_1 = data[48].Trim();
                if (!string.IsNullOrWhiteSpace(data[49])) provider.Provider_License_Number_State_Code_1 = data[49].Trim();
                if (!string.IsNullOrWhiteSpace(data[50])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_1 = data[50].Trim();
                if (!string.IsNullOrWhiteSpace(data[51])) provider.Healthcare_Provider_Taxonomy_Code_2 = data[51].Trim();
                if (!string.IsNullOrWhiteSpace(data[52])) provider.Provider_License_Number_2 = data[52].Trim();
                if (!string.IsNullOrWhiteSpace(data[53])) provider.Provider_License_Number_State_Code_2 = data[53].Trim();
                if (!string.IsNullOrWhiteSpace(data[54])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_2 = data[54].Trim();
                if (!string.IsNullOrWhiteSpace(data[55])) provider.Healthcare_Provider_Taxonomy_Code_3 = data[55].Trim();
                if (!string.IsNullOrWhiteSpace(data[56])) provider.Provider_License_Number_3 = data[56].Trim();
                if (!string.IsNullOrWhiteSpace(data[57])) provider.Provider_License_Number_State_Code_3 = data[57].Trim();
                if (!string.IsNullOrWhiteSpace(data[58])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_3 = data[58].Trim();
                if (!string.IsNullOrWhiteSpace(data[59])) provider.Healthcare_Provider_Taxonomy_Code_4 = data[59].Trim();
                if (!string.IsNullOrWhiteSpace(data[60])) provider.Provider_License_Number_4 = data[60].Trim();
                if (!string.IsNullOrWhiteSpace(data[61])) provider.Provider_License_Number_State_Code_4 = data[61].Trim();
                if (!string.IsNullOrWhiteSpace(data[62])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_4 = data[62].Trim();
                if (!string.IsNullOrWhiteSpace(data[63])) provider.Healthcare_Provider_Taxonomy_Code_5 = data[63].Trim();
                if (!string.IsNullOrWhiteSpace(data[64])) provider.Provider_License_Number_5 = data[64].Trim();
                if (!string.IsNullOrWhiteSpace(data[65])) provider.Provider_License_Number_State_Code_5 = data[65].Trim();
                if (!string.IsNullOrWhiteSpace(data[66])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_5 = data[66].Trim();
                if (!string.IsNullOrWhiteSpace(data[67])) provider.Healthcare_Provider_Taxonomy_Code_6 = data[67].Trim();
                if (!string.IsNullOrWhiteSpace(data[68])) provider.Provider_License_Number_6 = data[68].Trim();
                if (!string.IsNullOrWhiteSpace(data[69])) provider.Provider_License_Number_State_Code_6 = data[69].Trim();
                if (!string.IsNullOrWhiteSpace(data[70])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_6 = data[70].Trim();
                if (!string.IsNullOrWhiteSpace(data[71])) provider.Healthcare_Provider_Taxonomy_Code_7 = data[71].Trim();
                if (!string.IsNullOrWhiteSpace(data[72])) provider.Provider_License_Number_7 = data[72].Trim();
                if (!string.IsNullOrWhiteSpace(data[73])) provider.Provider_License_Number_State_Code_7 = data[73].Trim();
                if (!string.IsNullOrWhiteSpace(data[74])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_7 = data[74].Trim();
                if (!string.IsNullOrWhiteSpace(data[75])) provider.Healthcare_Provider_Taxonomy_Code_8 = data[75].Trim();
                if (!string.IsNullOrWhiteSpace(data[76])) provider.Provider_License_Number_8 = data[76].Trim();
                if (!string.IsNullOrWhiteSpace(data[77])) provider.Provider_License_Number_State_Code_8 = data[77].Trim();
                if (!string.IsNullOrWhiteSpace(data[78])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_8 = data[78].Trim();
                if (!string.IsNullOrWhiteSpace(data[79])) provider.Healthcare_Provider_Taxonomy_Code_9 = data[79].Trim();
                if (!string.IsNullOrWhiteSpace(data[80])) provider.Provider_License_Number_9 = data[80].Trim();
                if (!string.IsNullOrWhiteSpace(data[81])) provider.Provider_License_Number_State_Code_9 = data[81].Trim();
                if (!string.IsNullOrWhiteSpace(data[82])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_9 = data[82].Trim();
                if (!string.IsNullOrWhiteSpace(data[83])) provider.Healthcare_Provider_Taxonomy_Code_10 = data[83].Trim();
                if (!string.IsNullOrWhiteSpace(data[84])) provider.Provider_License_Number_10 = data[84].Trim();
                if (!string.IsNullOrWhiteSpace(data[85])) provider.Provider_License_Number_State_Code_10 = data[85].Trim();
                if (!string.IsNullOrWhiteSpace(data[86])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_10 = data[86].Trim();
                if (!string.IsNullOrWhiteSpace(data[87])) provider.Healthcare_Provider_Taxonomy_Code_11 = data[87].Trim();
                if (!string.IsNullOrWhiteSpace(data[88])) provider.Provider_License_Number_11 = data[88].Trim();
                if (!string.IsNullOrWhiteSpace(data[89])) provider.Provider_License_Number_State_Code_11 = data[89].Trim();
                if (!string.IsNullOrWhiteSpace(data[90])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_11 = data[90].Trim();
                if (!string.IsNullOrWhiteSpace(data[91])) provider.Healthcare_Provider_Taxonomy_Code_12 = data[91].Trim();
                if (!string.IsNullOrWhiteSpace(data[92])) provider.Provider_License_Number_12 = data[92].Trim();
                if (!string.IsNullOrWhiteSpace(data[93])) provider.Provider_License_Number_State_Code_12 = data[93].Trim();
                if (!string.IsNullOrWhiteSpace(data[94])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_12 = data[94].Trim();
                if (!string.IsNullOrWhiteSpace(data[95])) provider.Healthcare_Provider_Taxonomy_Code_13 = data[95].Trim();
                if (!string.IsNullOrWhiteSpace(data[96])) provider.Provider_License_Number_13 = data[96].Trim();
                if (!string.IsNullOrWhiteSpace(data[97])) provider.Provider_License_Number_State_Code_13 = data[97].Trim();
                if (!string.IsNullOrWhiteSpace(data[98])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_13 = data[98].Trim();
                if (!string.IsNullOrWhiteSpace(data[99])) provider.Healthcare_Provider_Taxonomy_Code_14 = data[99].Trim();
                if (!string.IsNullOrWhiteSpace(data[100])) provider.Provider_License_Number_14 = data[100].Trim();
                if (!string.IsNullOrWhiteSpace(data[101])) provider.Provider_License_Number_State_Code_14 = data[101].Trim();
                if (!string.IsNullOrWhiteSpace(data[102])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_14 = data[102].Trim();
                if (!string.IsNullOrWhiteSpace(data[103])) provider.Healthcare_Provider_Taxonomy_Code_15 = data[103].Trim();
                if (!string.IsNullOrWhiteSpace(data[104])) provider.Provider_License_Number_15 = data[104].Trim();
                if (!string.IsNullOrWhiteSpace(data[105])) provider.Provider_License_Number_State_Code_15 = data[105].Trim();
                if (!string.IsNullOrWhiteSpace(data[106])) provider.Healthcare_Provider_Primary_Taxonomy_Switch_15 = data[106].Trim();
                if (!string.IsNullOrWhiteSpace(data[107])) provider.Other_Provider_Identifier_1 = data[107].Trim();
                if (!string.IsNullOrWhiteSpace(data[108])) provider.Other_Provider_Identifier_Type_Code_1 = data[108].Trim();
                if (!string.IsNullOrWhiteSpace(data[109])) provider.Other_Provider_Identifier_State_1 = data[109].Trim();
                if (!string.IsNullOrWhiteSpace(data[110])) provider.Other_Provider_Identifier_Issuer_1 = data[110].Trim();
                if (!string.IsNullOrWhiteSpace(data[111])) provider.Other_Provider_Identifier_2 = data[111].Trim();
                if (!string.IsNullOrWhiteSpace(data[112])) provider.Other_Provider_Identifier_Type_Code_2 = data[112].Trim();
                if (!string.IsNullOrWhiteSpace(data[113])) provider.Other_Provider_Identifier_State_2 = data[113].Trim();
                if (!string.IsNullOrWhiteSpace(data[114])) provider.Other_Provider_Identifier_Issuer_2 = data[114].Trim();
                if (!string.IsNullOrWhiteSpace(data[115])) provider.Other_Provider_Identifier_3 = data[115].Trim();
                if (!string.IsNullOrWhiteSpace(data[116])) provider.Other_Provider_Identifier_Type_Code_3 = data[116].Trim();
                if (!string.IsNullOrWhiteSpace(data[117])) provider.Other_Provider_Identifier_State_3 = data[117].Trim();
                if (!string.IsNullOrWhiteSpace(data[118])) provider.Other_Provider_Identifier_Issuer_3 = data[118].Trim();
                if (!string.IsNullOrWhiteSpace(data[119])) provider.Other_Provider_Identifier_4 = data[119].Trim();
                if (!string.IsNullOrWhiteSpace(data[120])) provider.Other_Provider_Identifier_Type_Code_4 = data[120].Trim();
                if (!string.IsNullOrWhiteSpace(data[121])) provider.Other_Provider_Identifier_State_4 = data[121].Trim();
                if (!string.IsNullOrWhiteSpace(data[122])) provider.Other_Provider_Identifier_Issuer_4 = data[122].Trim();
                if (!string.IsNullOrWhiteSpace(data[123])) provider.Other_Provider_Identifier_5 = data[123].Trim();
                if (!string.IsNullOrWhiteSpace(data[124])) provider.Other_Provider_Identifier_Type_Code_5 = data[124].Trim();
                if (!string.IsNullOrWhiteSpace(data[125])) provider.Other_Provider_Identifier_State_5 = data[125].Trim();
                if (!string.IsNullOrWhiteSpace(data[126])) provider.Other_Provider_Identifier_Issuer_5 = data[126].Trim();
                if (!string.IsNullOrWhiteSpace(data[127])) provider.Other_Provider_Identifier_6 = data[127].Trim();
                if (!string.IsNullOrWhiteSpace(data[128])) provider.Other_Provider_Identifier_Type_Code_6 = data[128].Trim();
                if (!string.IsNullOrWhiteSpace(data[129])) provider.Other_Provider_Identifier_State_6 = data[129].Trim();
                if (!string.IsNullOrWhiteSpace(data[130])) provider.Other_Provider_Identifier_Issuer_6 = data[130].Trim();
                if (!string.IsNullOrWhiteSpace(data[131])) provider.Other_Provider_Identifier_7 = data[131].Trim();
                if (!string.IsNullOrWhiteSpace(data[132])) provider.Other_Provider_Identifier_Type_Code_7 = data[132].Trim();
                if (!string.IsNullOrWhiteSpace(data[133])) provider.Other_Provider_Identifier_State_7 = data[133].Trim();
                if (!string.IsNullOrWhiteSpace(data[134])) provider.Other_Provider_Identifier_Issuer_7 = data[134].Trim();
                if (!string.IsNullOrWhiteSpace(data[135])) provider.Other_Provider_Identifier_8 = data[135].Trim();
                if (!string.IsNullOrWhiteSpace(data[136])) provider.Other_Provider_Identifier_Type_Code_8 = data[136].Trim();
                if (!string.IsNullOrWhiteSpace(data[137])) provider.Other_Provider_Identifier_State_8 = data[137].Trim();
                if (!string.IsNullOrWhiteSpace(data[138])) provider.Other_Provider_Identifier_Issuer_8 = data[138].Trim();
                if (!string.IsNullOrWhiteSpace(data[139])) provider.Other_Provider_Identifier_9 = data[139].Trim();
                if (!string.IsNullOrWhiteSpace(data[140])) provider.Other_Provider_Identifier_Type_Code_9 = data[140].Trim();
                if (!string.IsNullOrWhiteSpace(data[141])) provider.Other_Provider_Identifier_State_9 = data[141].Trim();
                if (!string.IsNullOrWhiteSpace(data[142])) provider.Other_Provider_Identifier_Issuer_9 = data[142].Trim();
                if (!string.IsNullOrWhiteSpace(data[143])) provider.Other_Provider_Identifier_10 = data[143].Trim();
                if (!string.IsNullOrWhiteSpace(data[144])) provider.Other_Provider_Identifier_Type_Code_10 = data[144].Trim();
                if (!string.IsNullOrWhiteSpace(data[145])) provider.Other_Provider_Identifier_State_10 = data[145].Trim();
                if (!string.IsNullOrWhiteSpace(data[146])) provider.Other_Provider_Identifier_Issuer_10 = data[146].Trim();
                if (!string.IsNullOrWhiteSpace(data[147])) provider.Other_Provider_Identifier_11 = data[147].Trim();
                if (!string.IsNullOrWhiteSpace(data[148])) provider.Other_Provider_Identifier_Type_Code_11 = data[148].Trim();
                if (!string.IsNullOrWhiteSpace(data[149])) provider.Other_Provider_Identifier_State_11 = data[149].Trim();
                if (!string.IsNullOrWhiteSpace(data[150])) provider.Other_Provider_Identifier_Issuer_11 = data[150].Trim();
                if (!string.IsNullOrWhiteSpace(data[151])) provider.Other_Provider_Identifier_12 = data[151].Trim();
                if (!string.IsNullOrWhiteSpace(data[152])) provider.Other_Provider_Identifier_Type_Code_12 = data[152].Trim();
                if (!string.IsNullOrWhiteSpace(data[153])) provider.Other_Provider_Identifier_State_12 = data[153].Trim();
                if (!string.IsNullOrWhiteSpace(data[154])) provider.Other_Provider_Identifier_Issuer_12 = data[154].Trim();
                if (!string.IsNullOrWhiteSpace(data[155])) provider.Other_Provider_Identifier_13 = data[155].Trim();
                if (!string.IsNullOrWhiteSpace(data[156])) provider.Other_Provider_Identifier_Type_Code_13 = data[156].Trim();
                if (!string.IsNullOrWhiteSpace(data[157])) provider.Other_Provider_Identifier_State_13 = data[157].Trim();
                if (!string.IsNullOrWhiteSpace(data[158])) provider.Other_Provider_Identifier_Issuer_13 = data[158].Trim();
                if (!string.IsNullOrWhiteSpace(data[159])) provider.Other_Provider_Identifier_14 = data[159].Trim();
                if (!string.IsNullOrWhiteSpace(data[160])) provider.Other_Provider_Identifier_Type_Code_14 = data[160].Trim();
                if (!string.IsNullOrWhiteSpace(data[161])) provider.Other_Provider_Identifier_State_14 = data[161].Trim();
                if (!string.IsNullOrWhiteSpace(data[162])) provider.Other_Provider_Identifier_Issuer_14 = data[162].Trim();
                if (!string.IsNullOrWhiteSpace(data[163])) provider.Other_Provider_Identifier_15 = data[163].Trim();
                if (!string.IsNullOrWhiteSpace(data[164])) provider.Other_Provider_Identifier_Type_Code_15 = data[164].Trim();
                if (!string.IsNullOrWhiteSpace(data[165])) provider.Other_Provider_Identifier_State_15 = data[165].Trim();
                if (!string.IsNullOrWhiteSpace(data[166])) provider.Other_Provider_Identifier_Issuer_15 = data[166].Trim();
                if (!string.IsNullOrWhiteSpace(data[167])) provider.Other_Provider_Identifier_16 = data[167].Trim();
                if (!string.IsNullOrWhiteSpace(data[168])) provider.Other_Provider_Identifier_Type_Code_16 = data[168].Trim();
                if (!string.IsNullOrWhiteSpace(data[169])) provider.Other_Provider_Identifier_State_16 = data[169].Trim();
                if (!string.IsNullOrWhiteSpace(data[170])) provider.Other_Provider_Identifier_Issuer_16 = data[170].Trim();
                if (!string.IsNullOrWhiteSpace(data[171])) provider.Other_Provider_Identifier_17 = data[171].Trim();
                if (!string.IsNullOrWhiteSpace(data[172])) provider.Other_Provider_Identifier_Type_Code_17 = data[172].Trim();
                if (!string.IsNullOrWhiteSpace(data[173])) provider.Other_Provider_Identifier_State_17 = data[173].Trim();
                if (!string.IsNullOrWhiteSpace(data[174])) provider.Other_Provider_Identifier_Issuer_17 = data[174].Trim();
                if (!string.IsNullOrWhiteSpace(data[175])) provider.Other_Provider_Identifier_18 = data[175].Trim();
                if (!string.IsNullOrWhiteSpace(data[176])) provider.Other_Provider_Identifier_Type_Code_18 = data[176].Trim();
                if (!string.IsNullOrWhiteSpace(data[177])) provider.Other_Provider_Identifier_State_18 = data[177].Trim();
                if (!string.IsNullOrWhiteSpace(data[178])) provider.Other_Provider_Identifier_Issuer_18 = data[178].Trim();
                if (!string.IsNullOrWhiteSpace(data[179])) provider.Other_Provider_Identifier_19 = data[179].Trim();
                if (!string.IsNullOrWhiteSpace(data[180])) provider.Other_Provider_Identifier_Type_Code_19 = data[180].Trim();
                if (!string.IsNullOrWhiteSpace(data[181])) provider.Other_Provider_Identifier_State_19 = data[181].Trim();
                if (!string.IsNullOrWhiteSpace(data[182])) provider.Other_Provider_Identifier_Issuer_19 = data[182].Trim();
                if (!string.IsNullOrWhiteSpace(data[183])) provider.Other_Provider_Identifier_20 = data[183].Trim();
                if (!string.IsNullOrWhiteSpace(data[184])) provider.Other_Provider_Identifier_Type_Code_20 = data[184].Trim();
                if (!string.IsNullOrWhiteSpace(data[185])) provider.Other_Provider_Identifier_State_20 = data[185].Trim();
                if (!string.IsNullOrWhiteSpace(data[186])) provider.Other_Provider_Identifier_Issuer_20 = data[186].Trim();
                if (!string.IsNullOrWhiteSpace(data[187])) provider.Other_Provider_Identifier_21 = data[187].Trim();
                if (!string.IsNullOrWhiteSpace(data[188])) provider.Other_Provider_Identifier_Type_Code_21 = data[188].Trim();
                if (!string.IsNullOrWhiteSpace(data[189])) provider.Other_Provider_Identifier_State_21 = data[189].Trim();
                if (!string.IsNullOrWhiteSpace(data[190])) provider.Other_Provider_Identifier_Issuer_21 = data[190].Trim();
                if (!string.IsNullOrWhiteSpace(data[191])) provider.Other_Provider_Identifier_22 = data[191].Trim();
                if (!string.IsNullOrWhiteSpace(data[192])) provider.Other_Provider_Identifier_Type_Code_22 = data[192].Trim();
                if (!string.IsNullOrWhiteSpace(data[193])) provider.Other_Provider_Identifier_State_22 = data[193].Trim();
                if (!string.IsNullOrWhiteSpace(data[194])) provider.Other_Provider_Identifier_Issuer_22 = data[194].Trim();
                if (!string.IsNullOrWhiteSpace(data[195])) provider.Other_Provider_Identifier_23 = data[195].Trim();
                if (!string.IsNullOrWhiteSpace(data[196])) provider.Other_Provider_Identifier_Type_Code_23 = data[196].Trim();
                if (!string.IsNullOrWhiteSpace(data[197])) provider.Other_Provider_Identifier_State_23 = data[197].Trim();
                if (!string.IsNullOrWhiteSpace(data[198])) provider.Other_Provider_Identifier_Issuer_23 = data[198].Trim();
                if (!string.IsNullOrWhiteSpace(data[199])) provider.Other_Provider_Identifier_24 = data[199].Trim();
                if (!string.IsNullOrWhiteSpace(data[200])) provider.Other_Provider_Identifier_Type_Code_24 = data[200].Trim();
                if (!string.IsNullOrWhiteSpace(data[201])) provider.Other_Provider_Identifier_State_24 = data[201].Trim();
                if (!string.IsNullOrWhiteSpace(data[202])) provider.Other_Provider_Identifier_Issuer_24 = data[202].Trim();
                if (!string.IsNullOrWhiteSpace(data[203])) provider.Other_Provider_Identifier_25 = data[203].Trim();
                if (!string.IsNullOrWhiteSpace(data[204])) provider.Other_Provider_Identifier_Type_Code_25 = data[204].Trim();
                if (!string.IsNullOrWhiteSpace(data[205])) provider.Other_Provider_Identifier_State_25 = data[205].Trim();
                if (!string.IsNullOrWhiteSpace(data[206])) provider.Other_Provider_Identifier_Issuer_25 = data[206].Trim();
                if (!string.IsNullOrWhiteSpace(data[207])) provider.Other_Provider_Identifier_26 = data[207].Trim();
                if (!string.IsNullOrWhiteSpace(data[208])) provider.Other_Provider_Identifier_Type_Code_26 = data[208].Trim();
                if (!string.IsNullOrWhiteSpace(data[209])) provider.Other_Provider_Identifier_State_26 = data[209].Trim();
                if (!string.IsNullOrWhiteSpace(data[210])) provider.Other_Provider_Identifier_Issuer_26 = data[210].Trim();
                if (!string.IsNullOrWhiteSpace(data[211])) provider.Other_Provider_Identifier_27 = data[211].Trim();
                if (!string.IsNullOrWhiteSpace(data[212])) provider.Other_Provider_Identifier_Type_Code_27 = data[212].Trim();
                if (!string.IsNullOrWhiteSpace(data[213])) provider.Other_Provider_Identifier_State_27 = data[213].Trim();
                if (!string.IsNullOrWhiteSpace(data[214])) provider.Other_Provider_Identifier_Issuer_27 = data[214].Trim();
                if (!string.IsNullOrWhiteSpace(data[215])) provider.Other_Provider_Identifier_28 = data[215].Trim();
                if (!string.IsNullOrWhiteSpace(data[216])) provider.Other_Provider_Identifier_Type_Code_28 = data[216].Trim();
                if (!string.IsNullOrWhiteSpace(data[217])) provider.Other_Provider_Identifier_State_28 = data[217].Trim();
                if (!string.IsNullOrWhiteSpace(data[218])) provider.Other_Provider_Identifier_Issuer_28 = data[218].Trim();
                if (!string.IsNullOrWhiteSpace(data[219])) provider.Other_Provider_Identifier_29 = data[219].Trim();
                if (!string.IsNullOrWhiteSpace(data[220])) provider.Other_Provider_Identifier_Type_Code_29 = data[220].Trim();
                if (!string.IsNullOrWhiteSpace(data[221])) provider.Other_Provider_Identifier_State_29 = data[221].Trim();
                if (!string.IsNullOrWhiteSpace(data[222])) provider.Other_Provider_Identifier_Issuer_29 = data[222].Trim();
                if (!string.IsNullOrWhiteSpace(data[223])) provider.Other_Provider_Identifier_30 = data[223].Trim();
                if (!string.IsNullOrWhiteSpace(data[224])) provider.Other_Provider_Identifier_Type_Code_30 = data[224].Trim();
                if (!string.IsNullOrWhiteSpace(data[225])) provider.Other_Provider_Identifier_State_30 = data[225].Trim();
                if (!string.IsNullOrWhiteSpace(data[226])) provider.Other_Provider_Identifier_Issuer_30 = data[226].Trim();
                if (!string.IsNullOrWhiteSpace(data[227])) provider.Other_Provider_Identifier_31 = data[227].Trim();
                if (!string.IsNullOrWhiteSpace(data[228])) provider.Other_Provider_Identifier_Type_Code_31 = data[228].Trim();
                if (!string.IsNullOrWhiteSpace(data[229])) provider.Other_Provider_Identifier_State_31 = data[229].Trim();
                if (!string.IsNullOrWhiteSpace(data[230])) provider.Other_Provider_Identifier_Issuer_31 = data[230].Trim();
                if (!string.IsNullOrWhiteSpace(data[231])) provider.Other_Provider_Identifier_32 = data[231].Trim();
                if (!string.IsNullOrWhiteSpace(data[232])) provider.Other_Provider_Identifier_Type_Code_32 = data[232].Trim();
                if (!string.IsNullOrWhiteSpace(data[233])) provider.Other_Provider_Identifier_State_32 = data[233].Trim();
                if (!string.IsNullOrWhiteSpace(data[234])) provider.Other_Provider_Identifier_Issuer_32 = data[234].Trim();
                if (!string.IsNullOrWhiteSpace(data[235])) provider.Other_Provider_Identifier_33 = data[235].Trim();
                if (!string.IsNullOrWhiteSpace(data[236])) provider.Other_Provider_Identifier_Type_Code_33 = data[236].Trim();
                if (!string.IsNullOrWhiteSpace(data[237])) provider.Other_Provider_Identifier_State_33 = data[237].Trim();
                if (!string.IsNullOrWhiteSpace(data[238])) provider.Other_Provider_Identifier_Issuer_33 = data[238].Trim();
                if (!string.IsNullOrWhiteSpace(data[239])) provider.Other_Provider_Identifier_34 = data[239].Trim();
                if (!string.IsNullOrWhiteSpace(data[240])) provider.Other_Provider_Identifier_Type_Code_34 = data[240].Trim();
                if (!string.IsNullOrWhiteSpace(data[241])) provider.Other_Provider_Identifier_State_34 = data[241].Trim();
                if (!string.IsNullOrWhiteSpace(data[242])) provider.Other_Provider_Identifier_Issuer_34 = data[242].Trim();
                if (!string.IsNullOrWhiteSpace(data[243])) provider.Other_Provider_Identifier_35 = data[243].Trim();
                if (!string.IsNullOrWhiteSpace(data[244])) provider.Other_Provider_Identifier_Type_Code_35 = data[244].Trim();
                if (!string.IsNullOrWhiteSpace(data[245])) provider.Other_Provider_Identifier_State_35 = data[245].Trim();
                if (!string.IsNullOrWhiteSpace(data[246])) provider.Other_Provider_Identifier_Issuer_35 = data[246].Trim();
                if (!string.IsNullOrWhiteSpace(data[247])) provider.Other_Provider_Identifier_36 = data[247].Trim();
                if (!string.IsNullOrWhiteSpace(data[248])) provider.Other_Provider_Identifier_Type_Code_36 = data[248].Trim();
                if (!string.IsNullOrWhiteSpace(data[249])) provider.Other_Provider_Identifier_State_36 = data[249].Trim();
                if (!string.IsNullOrWhiteSpace(data[250])) provider.Other_Provider_Identifier_Issuer_36 = data[250].Trim();
                if (!string.IsNullOrWhiteSpace(data[251])) provider.Other_Provider_Identifier_37 = data[251].Trim();
                if (!string.IsNullOrWhiteSpace(data[252])) provider.Other_Provider_Identifier_Type_Code_37 = data[252].Trim();
                if (!string.IsNullOrWhiteSpace(data[253])) provider.Other_Provider_Identifier_State_37 = data[253].Trim();
                if (!string.IsNullOrWhiteSpace(data[254])) provider.Other_Provider_Identifier_Issuer_37 = data[254].Trim();
                if (!string.IsNullOrWhiteSpace(data[255])) provider.Other_Provider_Identifier_38 = data[255].Trim();
                if (!string.IsNullOrWhiteSpace(data[256])) provider.Other_Provider_Identifier_Type_Code_38 = data[256].Trim();
                if (!string.IsNullOrWhiteSpace(data[257])) provider.Other_Provider_Identifier_State_38 = data[257].Trim();
                if (!string.IsNullOrWhiteSpace(data[258])) provider.Other_Provider_Identifier_Issuer_38 = data[258].Trim();
                if (!string.IsNullOrWhiteSpace(data[259])) provider.Other_Provider_Identifier_39 = data[259].Trim();
                if (!string.IsNullOrWhiteSpace(data[260])) provider.Other_Provider_Identifier_Type_Code_39 = data[260].Trim();
                if (!string.IsNullOrWhiteSpace(data[261])) provider.Other_Provider_Identifier_State_39 = data[261].Trim();
                if (!string.IsNullOrWhiteSpace(data[262])) provider.Other_Provider_Identifier_Issuer_39 = data[262].Trim();
                if (!string.IsNullOrWhiteSpace(data[263])) provider.Other_Provider_Identifier_40 = data[263].Trim();
                if (!string.IsNullOrWhiteSpace(data[264])) provider.Other_Provider_Identifier_Type_Code_40 = data[264].Trim();
                if (!string.IsNullOrWhiteSpace(data[265])) provider.Other_Provider_Identifier_State_40 = data[265].Trim();
                if (!string.IsNullOrWhiteSpace(data[266])) provider.Other_Provider_Identifier_Issuer_40 = data[266].Trim();
                if (!string.IsNullOrWhiteSpace(data[267])) provider.Other_Provider_Identifier_41 = data[267].Trim();
                if (!string.IsNullOrWhiteSpace(data[268])) provider.Other_Provider_Identifier_Type_Code_41 = data[268].Trim();
                if (!string.IsNullOrWhiteSpace(data[269])) provider.Other_Provider_Identifier_State_41 = data[269].Trim();
                if (!string.IsNullOrWhiteSpace(data[270])) provider.Other_Provider_Identifier_Issuer_41 = data[270].Trim();
                if (!string.IsNullOrWhiteSpace(data[271])) provider.Other_Provider_Identifier_42 = data[271].Trim();
                if (!string.IsNullOrWhiteSpace(data[272])) provider.Other_Provider_Identifier_Type_Code_42 = data[272].Trim();
                if (!string.IsNullOrWhiteSpace(data[273])) provider.Other_Provider_Identifier_State_42 = data[273].Trim();
                if (!string.IsNullOrWhiteSpace(data[274])) provider.Other_Provider_Identifier_Issuer_42 = data[274].Trim();
                if (!string.IsNullOrWhiteSpace(data[275])) provider.Other_Provider_Identifier_43 = data[275].Trim();
                if (!string.IsNullOrWhiteSpace(data[276])) provider.Other_Provider_Identifier_Type_Code_43 = data[276].Trim();
                if (!string.IsNullOrWhiteSpace(data[277])) provider.Other_Provider_Identifier_State_43 = data[277].Trim();
                if (!string.IsNullOrWhiteSpace(data[278])) provider.Other_Provider_Identifier_Issuer_43 = data[278].Trim();
                if (!string.IsNullOrWhiteSpace(data[279])) provider.Other_Provider_Identifier_44 = data[279].Trim();
                if (!string.IsNullOrWhiteSpace(data[280])) provider.Other_Provider_Identifier_Type_Code_44 = data[280].Trim();
                if (!string.IsNullOrWhiteSpace(data[281])) provider.Other_Provider_Identifier_State_44 = data[281].Trim();
                if (!string.IsNullOrWhiteSpace(data[282])) provider.Other_Provider_Identifier_Issuer_44 = data[282].Trim();
                if (!string.IsNullOrWhiteSpace(data[283])) provider.Other_Provider_Identifier_45 = data[283].Trim();
                if (!string.IsNullOrWhiteSpace(data[284])) provider.Other_Provider_Identifier_Type_Code_45 = data[284].Trim();
                if (!string.IsNullOrWhiteSpace(data[285])) provider.Other_Provider_Identifier_State_45 = data[285].Trim();
                if (!string.IsNullOrWhiteSpace(data[286])) provider.Other_Provider_Identifier_Issuer_45 = data[286].Trim();
                if (!string.IsNullOrWhiteSpace(data[287])) provider.Other_Provider_Identifier_46 = data[287].Trim();
                if (!string.IsNullOrWhiteSpace(data[288])) provider.Other_Provider_Identifier_Type_Code_46 = data[288].Trim();
                if (!string.IsNullOrWhiteSpace(data[289])) provider.Other_Provider_Identifier_State_46 = data[289].Trim();
                if (!string.IsNullOrWhiteSpace(data[290])) provider.Other_Provider_Identifier_Issuer_46 = data[290].Trim();
                if (!string.IsNullOrWhiteSpace(data[291])) provider.Other_Provider_Identifier_47 = data[291].Trim();
                if (!string.IsNullOrWhiteSpace(data[292])) provider.Other_Provider_Identifier_Type_Code_47 = data[292].Trim();
                if (!string.IsNullOrWhiteSpace(data[293])) provider.Other_Provider_Identifier_State_47 = data[293].Trim();
                if (!string.IsNullOrWhiteSpace(data[294])) provider.Other_Provider_Identifier_Issuer_47 = data[294].Trim();
                if (!string.IsNullOrWhiteSpace(data[295])) provider.Other_Provider_Identifier_48 = data[295].Trim();
                if (!string.IsNullOrWhiteSpace(data[296])) provider.Other_Provider_Identifier_Type_Code_48 = data[296].Trim();
                if (!string.IsNullOrWhiteSpace(data[297])) provider.Other_Provider_Identifier_State_48 = data[297].Trim();
                if (!string.IsNullOrWhiteSpace(data[298])) provider.Other_Provider_Identifier_Issuer_48 = data[298].Trim();
                if (!string.IsNullOrWhiteSpace(data[299])) provider.Other_Provider_Identifier_49 = data[299].Trim();
                if (!string.IsNullOrWhiteSpace(data[300])) provider.Other_Provider_Identifier_Type_Code_49 = data[300].Trim();
                if (!string.IsNullOrWhiteSpace(data[301])) provider.Other_Provider_Identifier_State_49 = data[301].Trim();
                if (!string.IsNullOrWhiteSpace(data[302])) provider.Other_Provider_Identifier_Issuer_49 = data[302].Trim();
                if (!string.IsNullOrWhiteSpace(data[303])) provider.Other_Provider_Identifier_50 = data[303].Trim();
                if (!string.IsNullOrWhiteSpace(data[304])) provider.Other_Provider_Identifier_Type_Code_50 = data[304].Trim();
                if (!string.IsNullOrWhiteSpace(data[305])) provider.Other_Provider_Identifier_State_50 = data[305].Trim();
                if (!string.IsNullOrWhiteSpace(data[306])) provider.Other_Provider_Identifier_Issuer_50 = data[306].Trim();
                if (!string.IsNullOrWhiteSpace(data[307])) provider.Is_Sole_Proprietor = data[307].Trim();
                if (!string.IsNullOrWhiteSpace(data[308])) provider.Is_Organization_Subpart = data[308].Trim();
                if (!string.IsNullOrWhiteSpace(data[309])) provider.Parent_Organization_LBN = data[309].Trim();
                if (!string.IsNullOrWhiteSpace(data[310])) provider.Parent_Organization_TIN = data[310].Trim();
                if (!string.IsNullOrWhiteSpace(data[311])) provider.Authorized_Official_Name_Prefix_Text = data[311].Trim();
                if (!string.IsNullOrWhiteSpace(data[312])) provider.Authorized_Official_Name_Suffix_Text = data[312].Trim();
                if (!string.IsNullOrWhiteSpace(data[313])) provider.Authorized_Official_Credential_Text = data[313].Trim();
                if (!string.IsNullOrWhiteSpace(data[314])) provider.Healthcare_Provider_Taxonomy_Group_1 = data[314].Trim();
                if (!string.IsNullOrWhiteSpace(data[315])) provider.Healthcare_Provider_Taxonomy_Group_2 = data[315].Trim();
                if (!string.IsNullOrWhiteSpace(data[316])) provider.Healthcare_Provider_Taxonomy_Group_3 = data[316].Trim();
                if (!string.IsNullOrWhiteSpace(data[317])) provider.Healthcare_Provider_Taxonomy_Group_4 = data[317].Trim();
                if (!string.IsNullOrWhiteSpace(data[318])) provider.Healthcare_Provider_Taxonomy_Group_5 = data[318].Trim();
                if (!string.IsNullOrWhiteSpace(data[319])) provider.Healthcare_Provider_Taxonomy_Group_6 = data[319].Trim();
                if (!string.IsNullOrWhiteSpace(data[320])) provider.Healthcare_Provider_Taxonomy_Group_7 = data[320].Trim();
                if (!string.IsNullOrWhiteSpace(data[321])) provider.Healthcare_Provider_Taxonomy_Group_8 = data[321].Trim();
                if (!string.IsNullOrWhiteSpace(data[322])) provider.Healthcare_Provider_Taxonomy_Group_9 = data[322].Trim();
                if (!string.IsNullOrWhiteSpace(data[323])) provider.Healthcare_Provider_Taxonomy_Group_10 = data[323].Trim();
                if (!string.IsNullOrWhiteSpace(data[324])) provider.Healthcare_Provider_Taxonomy_Group_11 = data[324].Trim();
                if (!string.IsNullOrWhiteSpace(data[325])) provider.Healthcare_Provider_Taxonomy_Group_12 = data[325].Trim();
                if (!string.IsNullOrWhiteSpace(data[326])) provider.Healthcare_Provider_Taxonomy_Group_13 = data[326].Trim();
                if (!string.IsNullOrWhiteSpace(data[327])) provider.Healthcare_Provider_Taxonomy_Group_14 = data[327].Trim();
                if (!string.IsNullOrWhiteSpace(data[328])) provider.Healthcare_Provider_Taxonomy_Group_15 = data[328].Trim();

                medicareDatabase.SaveChanges();

                WriteLine(string.Format("#{2}\t{0}\t{1}", provider.NPI, exists ? "Updated" : "Added", counter));
            }
        }

        private bool checkHeadersNPI(string[] headers) {
            string[] sources = new string[] { "NPI", "Entity Type Code", "Replacement NPI", "Employer Identification Number (EIN)", "Provider Organization Name (Legal Business Name)", "Provider Last Name (Legal Name)", "Provider First Name", "Provider Middle Name", "Provider Name Prefix Text", "Provider Name Suffix Text", "Provider Credential Text", "Provider Other Organization Name", "Provider Other Organization Name Type Code", "Provider Other Last Name", "Provider Other First Name", "Provider Other Middle Name", "Provider Other Name Prefix Text", "Provider Other Name Suffix Text", "Provider Other Credential Text", "Provider Other Last Name Type Code", "Provider First Line Business Mailing Address", "Provider Second Line Business Mailing Address", "Provider Business Mailing Address City Name", "Provider Business Mailing Address State Name", "Provider Business Mailing Address Postal Code", "Provider Business Mailing Address Country Code (If outside U.S.)", "Provider Business Mailing Address Telephone Number", "Provider Business Mailing Address Fax Number", "Provider First Line Business Practice Location Address", "Provider Second Line Business Practice Location Address", "Provider Business Practice Location Address City Name", "Provider Business Practice Location Address State Name", "Provider Business Practice Location Address Postal Code", "Provider Business Practice Location Address Country Code (If outside U.S.)", "Provider Business Practice Location Address Telephone Number", "Provider Business Practice Location Address Fax Number", "Provider Enumeration Date", "Last Update Date", "NPI Deactivation Reason Code", "NPI Deactivation Date", "NPI Reactivation Date", "Provider Gender Code", "Authorized Official Last Name", "Authorized Official First Name", "Authorized Official Middle Name", "Authorized Official Title or Position", "Authorized Official Telephone Number", "Healthcare Provider Taxonomy Code_1", "Provider License Number_1", "Provider License Number State Code_1", "Healthcare Provider Primary Taxonomy Switch_1", "Healthcare Provider Taxonomy Code_2", "Provider License Number_2", "Provider License Number State Code_2", "Healthcare Provider Primary Taxonomy Switch_2", "Healthcare Provider Taxonomy Code_3", "Provider License Number_3", "Provider License Number State Code_3", "Healthcare Provider Primary Taxonomy Switch_3", "Healthcare Provider Taxonomy Code_4", "Provider License Number_4", "Provider License Number State Code_4", "Healthcare Provider Primary Taxonomy Switch_4", "Healthcare Provider Taxonomy Code_5", "Provider License Number_5", "Provider License Number State Code_5", "Healthcare Provider Primary Taxonomy Switch_5", "Healthcare Provider Taxonomy Code_6", "Provider License Number_6", "Provider License Number State Code_6", "Healthcare Provider Primary Taxonomy Switch_6", "Healthcare Provider Taxonomy Code_7", "Provider License Number_7", "Provider License Number State Code_7", "Healthcare Provider Primary Taxonomy Switch_7", "Healthcare Provider Taxonomy Code_8", "Provider License Number_8", "Provider License Number State Code_8", "Healthcare Provider Primary Taxonomy Switch_8", "Healthcare Provider Taxonomy Code_9", "Provider License Number_9", "Provider License Number State Code_9", "Healthcare Provider Primary Taxonomy Switch_9", "Healthcare Provider Taxonomy Code_10", "Provider License Number_10", "Provider License Number State Code_10", "Healthcare Provider Primary Taxonomy Switch_10", "Healthcare Provider Taxonomy Code_11", "Provider License Number_11", "Provider License Number State Code_11", "Healthcare Provider Primary Taxonomy Switch_11", "Healthcare Provider Taxonomy Code_12", "Provider License Number_12", "Provider License Number State Code_12", "Healthcare Provider Primary Taxonomy Switch_12", "Healthcare Provider Taxonomy Code_13", "Provider License Number_13", "Provider License Number State Code_13", "Healthcare Provider Primary Taxonomy Switch_13", "Healthcare Provider Taxonomy Code_14", "Provider License Number_14", "Provider License Number State Code_14", "Healthcare Provider Primary Taxonomy Switch_14", "Healthcare Provider Taxonomy Code_15", "Provider License Number_15", "Provider License Number State Code_15", "Healthcare Provider Primary Taxonomy Switch_15", "Other Provider Identifier_1", "Other Provider Identifier Type Code_1", "Other Provider Identifier State_1", "Other Provider Identifier Issuer_1", "Other Provider Identifier_2", "Other Provider Identifier Type Code_2", "Other Provider Identifier State_2", "Other Provider Identifier Issuer_2", "Other Provider Identifier_3", "Other Provider Identifier Type Code_3", "Other Provider Identifier State_3", "Other Provider Identifier Issuer_3", "Other Provider Identifier_4", "Other Provider Identifier Type Code_4", "Other Provider Identifier State_4", "Other Provider Identifier Issuer_4", "Other Provider Identifier_5", "Other Provider Identifier Type Code_5", "Other Provider Identifier State_5", "Other Provider Identifier Issuer_5", "Other Provider Identifier_6", "Other Provider Identifier Type Code_6", "Other Provider Identifier State_6", "Other Provider Identifier Issuer_6", "Other Provider Identifier_7", "Other Provider Identifier Type Code_7", "Other Provider Identifier State_7", "Other Provider Identifier Issuer_7", "Other Provider Identifier_8", "Other Provider Identifier Type Code_8", "Other Provider Identifier State_8", "Other Provider Identifier Issuer_8", "Other Provider Identifier_9", "Other Provider Identifier Type Code_9", "Other Provider Identifier State_9", "Other Provider Identifier Issuer_9", "Other Provider Identifier_10", "Other Provider Identifier Type Code_10", "Other Provider Identifier State_10", "Other Provider Identifier Issuer_10", "Other Provider Identifier_11", "Other Provider Identifier Type Code_11", "Other Provider Identifier State_11", "Other Provider Identifier Issuer_11", "Other Provider Identifier_12", "Other Provider Identifier Type Code_12", "Other Provider Identifier State_12", "Other Provider Identifier Issuer_12", "Other Provider Identifier_13", "Other Provider Identifier Type Code_13", "Other Provider Identifier State_13", "Other Provider Identifier Issuer_13", "Other Provider Identifier_14", "Other Provider Identifier Type Code_14", "Other Provider Identifier State_14", "Other Provider Identifier Issuer_14", "Other Provider Identifier_15", "Other Provider Identifier Type Code_15", "Other Provider Identifier State_15", "Other Provider Identifier Issuer_15", "Other Provider Identifier_16", "Other Provider Identifier Type Code_16", "Other Provider Identifier State_16", "Other Provider Identifier Issuer_16", "Other Provider Identifier_17", "Other Provider Identifier Type Code_17", "Other Provider Identifier State_17", "Other Provider Identifier Issuer_17", "Other Provider Identifier_18", "Other Provider Identifier Type Code_18", "Other Provider Identifier State_18", "Other Provider Identifier Issuer_18", "Other Provider Identifier_19", "Other Provider Identifier Type Code_19", "Other Provider Identifier State_19", "Other Provider Identifier Issuer_19", "Other Provider Identifier_20", "Other Provider Identifier Type Code_20", "Other Provider Identifier State_20", "Other Provider Identifier Issuer_20", "Other Provider Identifier_21", "Other Provider Identifier Type Code_21", "Other Provider Identifier State_21", "Other Provider Identifier Issuer_21", "Other Provider Identifier_22", "Other Provider Identifier Type Code_22", "Other Provider Identifier State_22", "Other Provider Identifier Issuer_22", "Other Provider Identifier_23", "Other Provider Identifier Type Code_23", "Other Provider Identifier State_23", "Other Provider Identifier Issuer_23", "Other Provider Identifier_24", "Other Provider Identifier Type Code_24", "Other Provider Identifier State_24", "Other Provider Identifier Issuer_24", "Other Provider Identifier_25", "Other Provider Identifier Type Code_25", "Other Provider Identifier State_25", "Other Provider Identifier Issuer_25", "Other Provider Identifier_26", "Other Provider Identifier Type Code_26", "Other Provider Identifier State_26", "Other Provider Identifier Issuer_26", "Other Provider Identifier_27", "Other Provider Identifier Type Code_27", "Other Provider Identifier State_27", "Other Provider Identifier Issuer_27", "Other Provider Identifier_28", "Other Provider Identifier Type Code_28", "Other Provider Identifier State_28", "Other Provider Identifier Issuer_28", "Other Provider Identifier_29", "Other Provider Identifier Type Code_29", "Other Provider Identifier State_29", "Other Provider Identifier Issuer_29", "Other Provider Identifier_30", "Other Provider Identifier Type Code_30", "Other Provider Identifier State_30", "Other Provider Identifier Issuer_30", "Other Provider Identifier_31", "Other Provider Identifier Type Code_31", "Other Provider Identifier State_31", "Other Provider Identifier Issuer_31", "Other Provider Identifier_32", "Other Provider Identifier Type Code_32", "Other Provider Identifier State_32", "Other Provider Identifier Issuer_32", "Other Provider Identifier_33", "Other Provider Identifier Type Code_33", "Other Provider Identifier State_33", "Other Provider Identifier Issuer_33", "Other Provider Identifier_34", "Other Provider Identifier Type Code_34", "Other Provider Identifier State_34", "Other Provider Identifier Issuer_34", "Other Provider Identifier_35", "Other Provider Identifier Type Code_35", "Other Provider Identifier State_35", "Other Provider Identifier Issuer_35", "Other Provider Identifier_36", "Other Provider Identifier Type Code_36", "Other Provider Identifier State_36", "Other Provider Identifier Issuer_36", "Other Provider Identifier_37", "Other Provider Identifier Type Code_37", "Other Provider Identifier State_37", "Other Provider Identifier Issuer_37", "Other Provider Identifier_38", "Other Provider Identifier Type Code_38", "Other Provider Identifier State_38", "Other Provider Identifier Issuer_38", "Other Provider Identifier_39", "Other Provider Identifier Type Code_39", "Other Provider Identifier State_39", "Other Provider Identifier Issuer_39", "Other Provider Identifier_40", "Other Provider Identifier Type Code_40", "Other Provider Identifier State_40", "Other Provider Identifier Issuer_40", "Other Provider Identifier_41", "Other Provider Identifier Type Code_41", "Other Provider Identifier State_41", "Other Provider Identifier Issuer_41", "Other Provider Identifier_42", "Other Provider Identifier Type Code_42", "Other Provider Identifier State_42", "Other Provider Identifier Issuer_42", "Other Provider Identifier_43", "Other Provider Identifier Type Code_43", "Other Provider Identifier State_43", "Other Provider Identifier Issuer_43", "Other Provider Identifier_44", "Other Provider Identifier Type Code_44", "Other Provider Identifier State_44", "Other Provider Identifier Issuer_44", "Other Provider Identifier_45", "Other Provider Identifier Type Code_45", "Other Provider Identifier State_45", "Other Provider Identifier Issuer_45", "Other Provider Identifier_46", "Other Provider Identifier Type Code_46", "Other Provider Identifier State_46", "Other Provider Identifier Issuer_46", "Other Provider Identifier_47", "Other Provider Identifier Type Code_47", "Other Provider Identifier State_47", "Other Provider Identifier Issuer_47", "Other Provider Identifier_48", "Other Provider Identifier Type Code_48", "Other Provider Identifier State_48", "Other Provider Identifier Issuer_48", "Other Provider Identifier_49", "Other Provider Identifier Type Code_49", "Other Provider Identifier State_49", "Other Provider Identifier Issuer_49", "Other Provider Identifier_50", "Other Provider Identifier Type Code_50", "Other Provider Identifier State_50", "Other Provider Identifier Issuer_50", "Is Sole Proprietor", "Is Organization Subpart", "Parent Organization LBN", "Parent Organization TIN", "Authorized Official Name Prefix Text", "Authorized Official Name Suffix Text", "Authorized Official Credential Text", "Healthcare Provider Taxonomy Group_1", "Healthcare Provider Taxonomy Group_2", "Healthcare Provider Taxonomy Group_3", "Healthcare Provider Taxonomy Group_4", "Healthcare Provider Taxonomy Group_5", "Healthcare Provider Taxonomy Group_6", "Healthcare Provider Taxonomy Group_7", "Healthcare Provider Taxonomy Group_8", "Healthcare Provider Taxonomy Group_9", "Healthcare Provider Taxonomy Group_10", "Healthcare Provider Taxonomy Group_11", "Healthcare Provider Taxonomy Group_12", "Healthcare Provider Taxonomy Group_13", "Healthcare Provider Taxonomy Group_14", "Healthcare Provider Taxonomy Group_15" };

            return HeaderComparer.checkHeaders(sources, headers);
        }

        #endregion

        #region Physician

        public void importPhysicians(string file) {
            using (var parser = new TextFieldParser(file)) {
                parser.TextFieldType = FieldType.Delimited;
                parser.SetDelimiters(getColumnDelimiter());
                parser.HasFieldsEnclosedInQuotes = true;

                // read the headers stored on the first line
                var headers = parser.ReadFields();

                //WriteLine(string.Join(",", headers.Select(header => string.Format("\"{0}\"", header)))); return;

                //for (var i = 0; i < headers.Count(); ++i) { WriteLine(string.Format(
                //    "if (!string.IsNullOrWhiteSpace(data[{1}])) physician.{0} = data[{1}].Trim();",
                //    headers[i].Replace(' ', '_'), i)); } return;

                if (!checkHeadersPhysician(headers)) {
                    WriteLine(DEFAULT_FAILED_HEADER_CHECK_RESPONSE);

                    // stop processing
                    return;
                }

                importData(parser, processRowPhysician);
            }
        }

        private void processRowPhysician(string[] data, int counter) {
            using (var medicareDatabase = new MedicareEntities()) {
                int NPI = 0;

                if (!int.TryParse(data[0], out NPI))
                    return;

                var physician = new Physician { NPI = NPI };

                var exists = medicareDatabase.Physicians.Where(x => x.NPI == NPI).Any();

                if (!exists) { // new
                    medicareDatabase.Physicians.Add(physician);
                }
                else {
                    medicareDatabase.Physicians.Attach(physician);
                    medicareDatabase.Entry(physician).State = System.Data.Entity.EntityState.Modified;
                }

                if (!string.IsNullOrWhiteSpace(data[1])) physician.PAC_ID = data[1].Trim();
                if (!string.IsNullOrWhiteSpace(data[2])) physician.Professional_Enrollment_ID = data[2].Trim();
                if (!string.IsNullOrWhiteSpace(data[3])) physician.Last_Name = data[3].Trim();
                if (!string.IsNullOrWhiteSpace(data[4])) physician.First_Name = data[4].Trim();
                if (!string.IsNullOrWhiteSpace(data[5])) physician.Middle_Name = data[5].Trim();
                if (!string.IsNullOrWhiteSpace(data[6])) physician.Suffix = data[6].Trim();
                if (!string.IsNullOrWhiteSpace(data[7])) physician.Gender = data[7].Trim();
                if (!string.IsNullOrWhiteSpace(data[8])) physician.Credential = data[8].Trim();
                if (!string.IsNullOrWhiteSpace(data[9])) physician.Medical_school_name = data[9].Trim();
                if (!string.IsNullOrWhiteSpace(data[10])) physician.Graduation_year = short.Parse(data[10].Trim());
                if (!string.IsNullOrWhiteSpace(data[11])) physician.Primary_specialty = data[11].Trim();
                if (!string.IsNullOrWhiteSpace(data[12])) physician.Secondary_specialty_1 = data[12].Trim();
                if (!string.IsNullOrWhiteSpace(data[13])) physician.Secondary_specialty_2 = data[13].Trim();
                if (!string.IsNullOrWhiteSpace(data[14])) physician.Secondary_specialty_3 = data[14].Trim();
                if (!string.IsNullOrWhiteSpace(data[15])) physician.Secondary_specialty_4 = data[15].Trim();
                if (!string.IsNullOrWhiteSpace(data[16])) physician.All_secondary_specialties = data[16].Trim();
                if (!string.IsNullOrWhiteSpace(data[17])) physician.Organization_legal_name = data[17].Trim();
                if (!string.IsNullOrWhiteSpace(data[18])) physician.Group_Practice_PAC_ID = data[18].Trim();
                if (!string.IsNullOrWhiteSpace(data[19])) physician.Number_of_Group_Practice_members = short.Parse(data[19].Trim());
                if (!string.IsNullOrWhiteSpace(data[20])) physician.Line_1_Street_Address = data[20].Trim();
                if (!string.IsNullOrWhiteSpace(data[21])) physician.Line_2_Street_Address = data[21].Trim();
                if (!string.IsNullOrWhiteSpace(data[22])) physician.Marker_of_address_line_2_suppression = data[22].Trim();
                if (!string.IsNullOrWhiteSpace(data[23])) physician.City = data[23].Trim();
                if (!string.IsNullOrWhiteSpace(data[24])) physician.State = data[24].Trim();
                if (!string.IsNullOrWhiteSpace(data[25])) physician.Zip_Code = data[25].Trim();
                if (!string.IsNullOrWhiteSpace(data[26])) physician.Phone_Number = data[26].Trim();
                if (!string.IsNullOrWhiteSpace(data[27])) physician.Claims_based_hospital_affiliation_CCN_1 = int.Parse(data[27].Trim());
                if (!string.IsNullOrWhiteSpace(data[28])) physician.Claims_based_hospital_affiliation_LBN_1 = data[28].Trim();
                if (!string.IsNullOrWhiteSpace(data[29])) physician.Claims_based_hospital_affiliation_CCN_2 = int.Parse(data[29].Trim());
                if (!string.IsNullOrWhiteSpace(data[30])) physician.Claims_based_hospital_affiliation_LBN_2 = data[30].Trim();
                if (!string.IsNullOrWhiteSpace(data[31])) physician.Claims_based_hospital_affiliation_CCN_3 = int.Parse(data[31].Trim());
                if (!string.IsNullOrWhiteSpace(data[32])) physician.Claims_based_hospital_affiliation_LBN_3 = data[32].Trim();
                if (!string.IsNullOrWhiteSpace(data[33])) physician.Claims_based_hospital_affiliation_CCN_4 = int.Parse(data[33].Trim());
                if (!string.IsNullOrWhiteSpace(data[34])) physician.Claims_based_hospital_affiliation_LBN_4 = data[34].Trim();
                if (!string.IsNullOrWhiteSpace(data[35])) physician.Claims_based_hospital_affiliation_CCN_5 = int.Parse(data[35].Trim());
                if (!string.IsNullOrWhiteSpace(data[36])) physician.Claims_based_hospital_affiliation_LBN_5 = data[36].Trim();
                if (!string.IsNullOrWhiteSpace(data[37])) physician.Professional_accepts_Medicare_Assignment = data[37].Trim();
                //if (!string.IsNullOrWhiteSpace(data[38])) physician.Participating_in_eRx = data[38].Trim();
                if (!string.IsNullOrWhiteSpace(data[39])) physician.Participating_in_EHR = data[39].Trim();
                if (!string.IsNullOrWhiteSpace(data[40])) physician.Participated_in_Million_Hearts = data[40].Trim();

                physician.LastModifiedDate = DateTime.Now;

                medicareDatabase.SaveChanges();

                WriteLine(string.Format("#{2}\t{0}\t{1}", physician.NPI, exists ? "Updated" : "Added", counter));
            }
        }

        private bool checkHeadersPhysician(string[] headers) {
            string[] sources = new string[] { "NPI", "PAC ID", "Professional Enrollment ID", "Last Name", "First Name", "Middle Name", "Suffix", "Gender", "Credential", "Medical school name", "Graduation year", "Primary specialty", "Secondary specialty 1", "Secondary specialty 2", "Secondary specialty 3", "Secondary specialty 4", "All secondary specialties", "Organization legal name", "Group Practice PAC ID", "Number of Group Practice members", "Line 1 Street Address", "Line 2 Street Address", "Marker of address line 2 suppression", "City", "State", "Zip Code", "Phone Number", "Hospital affiliation CCN 1", "Hospital affiliation LBN 1", "Hospital affiliation CCN 2", "Hospital affiliation LBN 2", "Hospital affiliation CCN 3", "Hospital affiliation LBN 3", "Hospital affiliation CCN 4", "Hospital affiliation LBN 4", "Hospital affiliation CCN 5", "Hospital affiliation LBN 5", "Professional accepts Medicare Assignment", "Reported Quality Measures", "Used electronic health records", "Committed to heart health through the Million Hearts® initiative." };

            return HeaderComparer.checkHeaders(sources, headers);
        }

        #endregion

        #region Aggregates

        public void importAggregates(string file) {
            using (var parser = new TextFieldParser(file)) {
                parser.TextFieldType = FieldType.Delimited;
                parser.SetDelimiters(getColumnDelimiter());
                parser.HasFieldsEnclosedInQuotes = true;

                // read the headers stored on the first line
                var headers = parser.ReadFields();

                //WriteLine(string.Join(",", headers.Select(header => string.Format("\"{0}\"", header)))); return;

                //for (var i = 0; i < headers.Count(); ++i) {
                //    WriteLine(string.Format(
                //        "if (!string.IsNullOrWhiteSpace(data[{1}])) aggregate.{0} = data[{1}].Trim();",
                //        headers[i].Replace(' ', '_'), i));
                //}
                //return;

                if (!checkHeadersAggregate(headers)) {
                    WriteLine(DEFAULT_FAILED_HEADER_CHECK_RESPONSE);

                    // stop processing
                    return;
                }

                importData(parser, processRowAggregate);
            }
        }

        private void processRowAggregate(string[] data, int counter) {
            var year = getDataYear();

            if (year <= MINIMUM_DATA_YEAR)
                throw new ArgumentException("Please specify the year of the data!");

            using (var medicareDatabase = new MedicareEntities()) {
                int NPI = 0;

                if (!int.TryParse(data[0], out NPI))
                    return;

                var aggregate = new MedicareProvidersAggregate { npi = NPI, year = year };

                var exists = medicareDatabase.MedicareProvidersAggregates
                    .Where(x => x.npi == NPI && x.year == year).Any();

                if (!exists) { // new
                    medicareDatabase.MedicareProvidersAggregates.Add(aggregate);
                }
                else {
                    medicareDatabase.MedicareProvidersAggregates.Attach(aggregate);
                    medicareDatabase.Entry(aggregate).State = System.Data.Entity.EntityState.Modified;
                }

                if (!string.IsNullOrWhiteSpace(data[15])) aggregate.number_of_hcpcs = int.Parse(data[15].Trim());
                if (!string.IsNullOrWhiteSpace(data[16])) aggregate.total_services = float.Parse(data[16].Trim());
                if (!string.IsNullOrWhiteSpace(data[17])) aggregate.total_unique_benes = int.Parse(data[17].Trim());
                if (!string.IsNullOrWhiteSpace(data[18])) aggregate.total_submitted_chrg_amt = float.Parse(data[18].Trim());
                if (!string.IsNullOrWhiteSpace(data[19])) aggregate.total_medicare_allowed_amt = float.Parse(data[19].Trim());
                if (!string.IsNullOrWhiteSpace(data[20])) aggregate.total_medicare_payment_amt = float.Parse(data[20].Trim());
                if (!string.IsNullOrWhiteSpace(data[21])) aggregate.total_medicare_stnd_amt = float.Parse(data[21].Trim());
                if (!string.IsNullOrWhiteSpace(data[22])) aggregate.drug_suppress_indicator = data[22].Trim();
                if (!string.IsNullOrWhiteSpace(data[23])) aggregate.number_of_drug_hcpcs = int.Parse(data[23].Trim());
                if (!string.IsNullOrWhiteSpace(data[24])) aggregate.total_drug_services = float.Parse(data[24].Trim());
                if (!string.IsNullOrWhiteSpace(data[25])) aggregate.total_drug_unique_benes = int.Parse(data[25].Trim());
                if (!string.IsNullOrWhiteSpace(data[26])) aggregate.total_drug_submitted_chrg_amt = float.Parse(data[26].Trim());
                if (!string.IsNullOrWhiteSpace(data[27])) aggregate.total_drug_medicare_allowed_amt = float.Parse(data[27].Trim());
                if (!string.IsNullOrWhiteSpace(data[28])) aggregate.total_drug_medicare_payment_amt = float.Parse(data[28].Trim());
                if (!string.IsNullOrWhiteSpace(data[29])) aggregate.total_drug_medicare_stnd_amt = float.Parse(data[29].Trim());
                if (!string.IsNullOrWhiteSpace(data[30])) aggregate.med_suppress_indicator = data[30].Trim();
                if (!string.IsNullOrWhiteSpace(data[31])) aggregate.number_of_med_hcpcs = int.Parse(data[31].Trim());
                if (!string.IsNullOrWhiteSpace(data[32])) aggregate.total_med_services = float.Parse(data[32].Trim());
                if (!string.IsNullOrWhiteSpace(data[33])) aggregate.total_med_unique_benes = int.Parse(data[33].Trim());
                if (!string.IsNullOrWhiteSpace(data[34])) aggregate.total_med_submitted_chrg_amt = float.Parse(data[34].Trim());
                if (!string.IsNullOrWhiteSpace(data[35])) aggregate.total_med_medicare_allowed_amt = float.Parse(data[35].Trim());
                if (!string.IsNullOrWhiteSpace(data[36])) aggregate.total_med_medicare_payment_amt = float.Parse(data[36].Trim());
                if (!string.IsNullOrWhiteSpace(data[37])) aggregate.total_med_medicare_stnd_amt = float.Parse(data[37].Trim());
                if (!string.IsNullOrWhiteSpace(data[38])) aggregate.beneficiary_average_age = short.Parse(data[38].Trim());
                if (!string.IsNullOrWhiteSpace(data[39])) aggregate.beneficiary_age_less_65_count = int.Parse(data[39].Trim());
                if (!string.IsNullOrWhiteSpace(data[40])) aggregate.beneficiary_age_65_74_count = int.Parse(data[40].Trim());
                if (!string.IsNullOrWhiteSpace(data[41])) aggregate.beneficiary_age_75_84_count = int.Parse(data[41].Trim());
                if (!string.IsNullOrWhiteSpace(data[42])) aggregate.beneficiary_age_greater_84_count = int.Parse(data[42].Trim());
                if (!string.IsNullOrWhiteSpace(data[43])) aggregate.beneficiary_female_count = int.Parse(data[43].Trim());
                if (!string.IsNullOrWhiteSpace(data[44])) aggregate.beneficiary_male_count = int.Parse(data[44].Trim());
                if (!string.IsNullOrWhiteSpace(data[45])) aggregate.beneficiary_race_white_count = int.Parse(data[45].Trim());
                if (!string.IsNullOrWhiteSpace(data[46])) aggregate.beneficiary_race_black_count = int.Parse(data[46].Trim());
                if (!string.IsNullOrWhiteSpace(data[47])) aggregate.beneficiary_race_api_count = int.Parse(data[47].Trim());
                if (!string.IsNullOrWhiteSpace(data[48])) aggregate.beneficiary_race_hispanic_count = int.Parse(data[48].Trim());
                if (!string.IsNullOrWhiteSpace(data[49])) aggregate.beneficiary_race_natind_count = int.Parse(data[49].Trim());
                if (!string.IsNullOrWhiteSpace(data[50])) aggregate.beneficiary_race_other_count = int.Parse(data[50].Trim());
                if (!string.IsNullOrWhiteSpace(data[51])) aggregate.beneficiary_nondual_count = int.Parse(data[51].Trim());
                if (!string.IsNullOrWhiteSpace(data[52])) aggregate.beneficiary_dual_count = int.Parse(data[52].Trim());
                if (!string.IsNullOrWhiteSpace(data[53])) aggregate.beneficiary_cc_afib_percent = short.Parse(data[53].Trim());
                if (!string.IsNullOrWhiteSpace(data[54])) aggregate.beneficiary_cc_alzrdsd_percent = short.Parse(data[54].Trim());
                if (!string.IsNullOrWhiteSpace(data[55])) aggregate.beneficiary_cc_asthma_percent = short.Parse(data[55].Trim());
                if (!string.IsNullOrWhiteSpace(data[56])) aggregate.beneficiary_cc_cancer_percent = short.Parse(data[56].Trim());
                if (!string.IsNullOrWhiteSpace(data[57])) aggregate.beneficiary_cc_chf_percent = short.Parse(data[57].Trim());
                if (!string.IsNullOrWhiteSpace(data[58])) aggregate.beneficiary_cc_ckd_percent = short.Parse(data[58].Trim());
                if (!string.IsNullOrWhiteSpace(data[59])) aggregate.beneficiary_cc_copd_percent = short.Parse(data[59].Trim());
                if (!string.IsNullOrWhiteSpace(data[60])) aggregate.beneficiary_cc_depr_percent = short.Parse(data[60].Trim());
                if (!string.IsNullOrWhiteSpace(data[61])) aggregate.beneficiary_cc_diab_percent = short.Parse(data[61].Trim());
                if (!string.IsNullOrWhiteSpace(data[62])) aggregate.beneficiary_cc_hyperl_percent = short.Parse(data[62].Trim());
                if (!string.IsNullOrWhiteSpace(data[63])) aggregate.beneficiary_cc_hypert_percent = short.Parse(data[63].Trim());
                if (!string.IsNullOrWhiteSpace(data[64])) aggregate.beneficiary_cc_ihd_percent = short.Parse(data[64].Trim());
                if (!string.IsNullOrWhiteSpace(data[65])) aggregate.beneficiary_cc_ost_percent = short.Parse(data[65].Trim());
                if (!string.IsNullOrWhiteSpace(data[66])) aggregate.beneficiary_cc_raoa_percent = short.Parse(data[66].Trim());
                if (!string.IsNullOrWhiteSpace(data[67])) aggregate.beneficiary_cc_schiot_percent = short.Parse(data[67].Trim());
                if (!string.IsNullOrWhiteSpace(data[68])) aggregate.beneficiary_cc_strk_percent = short.Parse(data[68].Trim());
                if (!string.IsNullOrWhiteSpace(data[69])) aggregate.beneficiary_average_risk_score = float.Parse(data[69].Trim());

                medicareDatabase.SaveChanges();

                WriteLine(string.Format("#{2}\t{0}\t{1}\t{3}", aggregate.npi, exists ? "Updated" : "Added", counter, year));
            }
        }

        private bool checkHeadersAggregate(string[] headers) {
            string[] sources = new string[] { "npi", "nppes_provider_last_org_name", "nppes_provider_first_name", "nppes_provider_mi", "nppes_credentials", "nppes_provider_gender", "nppes_entity_code", "nppes_provider_street1", "nppes_provider_street2", "nppes_provider_city", "nppes_provider_zip", "nppes_provider_state", "nppes_provider_country", "provider_type", "medicare_participation_indicator", "number_of_hcpcs", "total_services", "total_unique_benes", "total_submitted_chrg_amt", "total_medicare_allowed_amt", "total_medicare_payment_amt", "total_medicare_stnd_amt", "drug_suppress_indicator", "number_of_drug_hcpcs", "total_drug_services", "total_drug_unique_benes", "total_drug_submitted_chrg_amt", "total_drug_medicare_allowed_amt", "total_drug_medicare_payment_amt", "total_drug_medicare_stnd_amt", "med_suppress_indicator", "number_of_med_hcpcs", "total_med_services", "total_med_unique_benes", "total_med_submitted_chrg_amt", "total_med_medicare_allowed_amt", "total_med_medicare_payment_amt", "total_med_medicare_stnd_amt", "beneficiary_average_age", "beneficiary_age_less_65_count", "beneficiary_age_65_74_count", "beneficiary_age_75_84_count", "beneficiary_age_greater_84_count", "beneficiary_female_count", "beneficiary_male_count", "beneficiary_race_white_count", "beneficiary_race_black_count", "beneficiary_race_api_count", "beneficiary_race_hispanic_count", "beneficiary_race_natind_count", "beneficiary_race_other_count", "beneficiary_nondual_count", "beneficiary_dual_count", "beneficiary_cc_afib_percent", "beneficiary_cc_alzrdsd_percent", "beneficiary_cc_asthma_percent", "beneficiary_cc_cancer_percent", "beneficiary_cc_chf_percent", "beneficiary_cc_ckd_percent", "beneficiary_cc_copd_percent", "beneficiary_cc_depr_percent", "beneficiary_cc_diab_percent", "beneficiary_cc_hyperl_percent", "beneficiary_cc_hypert_percent", "beneficiary_cc_ihd_percent", "beneficiary_cc_ost_percent", "beneficiary_cc_raoa_percent", "beneficiary_cc_schiot_percent", "beneficiary_cc_strk_percent", "Beneficiary_Average_Risk_Score" };

            return HeaderComparer.checkHeaders(sources, headers);
        }

        #endregion

        #region UtilizationAndPayments

        public void importUtilizationAndPayments(string file) {
            using (var parser = new TextFieldParser(file)) {
                parser.TextFieldType = FieldType.Delimited;
                parser.SetDelimiters(getColumnDelimiter());
                parser.HasFieldsEnclosedInQuotes = false;

                // read the headers stored on the first line
                var headers = parser.ReadFields();

                //for (var i = 0; i < headers.Count(); ++i) { WriteLine(string.Format(
                //    "if (!string.IsNullOrWhiteSpace(data[{1}])) payment.{0} = data[{1}].Trim();",
                //    headers[i].Replace(' ', '_'), i)); } return;

                if (!checkHeadersUtilizationAndPayments(headers)) {
                    WriteLine(DEFAULT_FAILED_HEADER_CHECK_RESPONSE);
                    WriteLine(string.Join(",", headers.Select(header => string.Format("\"{0}\"", header))));

                    // stop processing
                    return;
                }

                importData(parser, processRowUtilizationAndPayment);
            }
        }

        private void processRowUtilizationAndPayment(string[] data, int counter) {
            var year = getDataYear();

            if (year <= MINIMUM_DATA_YEAR)
                throw new ArgumentException("Please specify the year of the data!");

            using (var medicareDatabase = new MedicareEntities()) {
                int NPI = 0;

                if (!int.TryParse(data[0], out NPI))
                    return;

                var hcpcs_code = data[16].Trim();
                var hcpcs_description = data[17].Trim();
                var hcpcs_drug_indicator = data[18].Trim();

                // check the HCPCS codes list
                addHcpcs(medicareDatabase, hcpcs_code, hcpcs_description, hcpcs_drug_indicator);

                var place_of_service = data[15].Trim();

                var payment = new MedicareProvidersUtilizationAndPayment { npi = NPI, year = year };

                var exists = medicareDatabase.MedicareProvidersUtilizationAndPayments
                    .Where(x => x.npi == NPI
                    && x.year == year
                    && x.place_of_service == place_of_service
                    && x.hcpcs_code == hcpcs_code).Any();

                if (!exists) { // new
                    medicareDatabase.MedicareProvidersUtilizationAndPayments.Add(payment);
                }
                else {
                    medicareDatabase.MedicareProvidersUtilizationAndPayments.Attach(payment);
                    medicareDatabase.Entry(payment).State = System.Data.Entity.EntityState.Modified;
                }

                if (!string.IsNullOrWhiteSpace(data[15])) payment.place_of_service = data[15].Trim();
                if (!string.IsNullOrWhiteSpace(data[16])) payment.hcpcs_code = data[16].Trim();
                //if (!string.IsNullOrWhiteSpace(data[17])) payment.hcpcs_description = data[17].Trim();
                //if (!string.IsNullOrWhiteSpace(data[18])) payment.hcpcs_drug_indicator = data[18].Trim();
                if (!string.IsNullOrWhiteSpace(data[19])) payment.line_srvc_cnt = double.Parse(data[19].Trim());
                if (!string.IsNullOrWhiteSpace(data[20])) payment.bene_unique_cnt = int.Parse(data[20].Trim());
                if (!string.IsNullOrWhiteSpace(data[21])) payment.bene_day_srvc_cnt = int.Parse(data[21].Trim());
                if (!string.IsNullOrWhiteSpace(data[22])) payment.average_medicare_allowed_amt = double.Parse(data[22].Trim());
                if (!string.IsNullOrWhiteSpace(data[23])) payment.average_submitted_chrg_amt = double.Parse(data[23].Trim());
                if (!string.IsNullOrWhiteSpace(data[24])) payment.average_medicare_payment_amt = double.Parse(data[24].Trim());
                if (!string.IsNullOrWhiteSpace(data[25])) payment.average_medicare_standard_amt = double.Parse(data[25].Trim());

                medicareDatabase.SaveChanges();

                WriteLine(string.Format("#{2}\t{0}\t{1}\t{3}\t{4}", payment.npi, exists ? "Updated" : "Added", counter, year, hcpcs_code));
            }
        }

        private bool checkHeadersUtilizationAndPayments(string[] headers) {
            string[] sources = new string[] { "NPI", "NPPES_PROVIDER_LAST_ORG_NAME", "NPPES_PROVIDER_FIRST_NAME", "NPPES_PROVIDER_MI", "NPPES_CREDENTIALS", "NPPES_PROVIDER_GENDER", "NPPES_ENTITY_CODE", "NPPES_PROVIDER_STREET1", "NPPES_PROVIDER_STREET2", "NPPES_PROVIDER_CITY", "NPPES_PROVIDER_ZIP", "NPPES_PROVIDER_STATE", "NPPES_PROVIDER_COUNTRY", "PROVIDER_TYPE", "MEDICARE_PARTICIPATION_INDICATOR", "PLACE_OF_SERVICE", "HCPCS_CODE", "HCPCS_DESCRIPTION", "HCPCS_DRUG_INDICATOR", "LINE_SRVC_CNT", "BENE_UNIQUE_CNT", "BENE_DAY_SRVC_CNT", "AVERAGE_MEDICARE_ALLOWED_AMT", "AVERAGE_SUBMITTED_CHRG_AMT", "AVERAGE_MEDICARE_PAYMENT_AMT", "AVERAGE_MEDICARE_STANDARD_AMT" };

            return HeaderComparer.checkHeaders(sources, headers);
        }

        private void addHcpcs(MedicareEntities medicareDatabase,
            string hcpcs_code, string hcpcs_description, string hcpcs_drug_indicator)
        {
            if (!string.IsNullOrEmpty(hcpcs_code)) {
                using (var transaction = new TransactionScope()) {
                    var hcpcs_exists = medicareDatabase.HCPCSCodes
                        .Where(x => x.HCPCS == hcpcs_code).Any();

                    if (hcpcs_exists) {
                        return;
                    }

                    medicareDatabase.HCPCSCodes.Add(new HCPCSCode {
                        HCPCS = hcpcs_code,
                        Description = hcpcs_description,
                        DrugIndicator = hcpcs_drug_indicator
                    });

                    medicareDatabase.SaveChanges();

                    // complete the transaction
                    transaction.Complete();
                }
            }
        }

        #endregion

        //#region Provider of Services - Other

        //public enum ProviderOfServicesOtherHeader
        //{
        //    PRVDR_CTGRY_SBTYP_CD, PRVDR_CTGRY_CD, CHOW_CNT, CHOW_DT, CITY_NAME, ACPTBL_POC_SW, CMPLNC_STUS_CD, SSA_CNTY_CD, CROSS_REF_PROVIDER_NUMBER, CRTFCTN_DT, ELGBLTY_SW, FAC_NAME, INTRMDRY_CARR_CD, MDCD_VNDR_NUM, ORGNL_PRTCPTN_DT, CHOW_PRIOR_DT, INTRMDRY_CARR_PRIOR_CD, PRVDR_NUM, RGN_CD, SKLTN_REC_SW, STATE_CD, SSA_STATE_CD, STATE_RGN_CD, ST_ADR, PHNE_NUM, PGM_TRMNTN_CD, TRMNTN_EXPRTN_DT, CRTFCTN_ACTN_TYPE_CD, GNRL_CNTL_TYPE_CD, ZIP_CD, FIPS_STATE_CD, FIPS_CNTY_CD, CBSA_URBN_RRL_IND, CBSA_CD, ACRDTN_EFCTV_DT, ACRDTN_EXPRTN_DT, ACRDTN_TYPE_CD, TOT_AFLTD_AMBLNC_SRVC_CNT, TOT_AFLTD_ASC_CNT, TOT_COLCTD_HOSP_CNT, TOT_AFLTD_ESRD_CNT, TOT_AFLTD_FQHC_CNT, TOT_AFLTD_HHA_CNT, TOT_AFLTD_HOSPC_CNT, TOT_AFLTD_OPO_CNT, TOT_AFLTD_PRTF_CNT, TOT_AFLTD_RHC_CNT, TOT_AFLTD_SNF_CNT, AFLTD_PRVDR_CNT, RSDNT_PGM_ALPTHC_SW, RSDNT_PGM_DNTL_SW, RSDNT_PGM_OSTPTHC_SW, RSDNT_PGM_OTHR_SW, RSDNT_PGM_PDTRC_SW, LAB_SRVC_CD, PHRMCY_SRVC_CD, RDLGY_SRVC_CD, ASC_BGN_SRVC_DT, FREESTNDNG_ASC_SW, OVRRD_BED_CNT_SW, CRTFD_BED_CNT, ICFIID_BED_CNT, MDCD_NF_BED_CNT, MDCR_SNF_BED_CNT, MDCR_MDCD_SNF_BED_CNT, AIDS_BED_CNT, ALZHMR_BED_CNT, DLYS_BED_CNT, DSBL_CHLDRN_BED_CNT, HEAD_TRMA_BED_CNT, HOSPC_BED_CNT, HNTGTN_DEASE_BED_CNT, REHAB_BED_CNT, VNTLTR_BED_CNT, BED_CNT, BRNCH_CNT, BRNCH_OPRTN_SW, CAH_PSYCH_DPU_SW, CAH_REHAB_DPU_SW, CAH_SB_SW, CRDC_CTHRTZTN_PRCDR_ROOMS_CNT, GNRL_FAC_TYPE_CD, CHOW_SW, CLIA_ID_NUMBER_1, CLIA_ID_NUMBER_2, CLIA_ID_NUMBER_3, CLIA_ID_NUMBER_4, CLIA_ID_NUMBER_5, COLCTN_STUS_SW, RN_24_HR_WVR_SW, RN_7_DAY_WVR_SW, BED_PER_ROOM_WVR_SW, LSC_WVR_SW, ROOM_SIZE_WVR_SW, ENDSCPY_PRCDR_ROOMS_CNT, ESRD_NTWRK_NUM, EXPRMT_RSRCH_CNDCTD_SW, FAX_PHNE_NUM, FY_END_MO_DAY_CD, FQHC_APPROVED_RHC_PROVIDER_NUM, FED_FUNDD_FQHC_SW, HHA_QLFYD_OPT_SPCH_SW, HH_AIDE_TRNG_PGM_CD, HOME_TRNG_SPRT_ONLY_SRVC_SW, MDCR_HOSPC_SW, HOSP_BSD_SW, INCNTR_NCTRNL_SRVC_SW, LTC_CROSS_REF_PROVIDER_NUMBER, MDCL_SCHL_AFLTN_CD, MEDICARE_HOSPICE_PROVIDER_NUM, MDCD_MDCR_PRTCPTG_PRVDR_SW, MEDICARE_MEDICAID_PRVDR_NUMBER, MLT_FAC_ORG_NAME, MLT_OWND_FAC_ORG_SW, NCRY_PRVDR_DSGNTD_DT, NCRY_PRVDR_DSGNTD_AS_SW, NCRY_PRVDR_LOST_DT, MEET_1861_SW, NPP_TYPE_CD, TOT_OFSITE_CNCR_HOSP_CNT, TOT_OFSITE_CHLDRN_HOSP_CNT, TOT_OFSITE_EMER_DEPT_CNT, TOT_OFSITE_INPTNT_LCTN_CNT, TOT_OFSITE_LTC_HOSP_CNT, TOT_OFSITE_OPTHLMC_SRGRY_CNT, TOT_OFSITE_OTHR_LCTN_CNT, TOT_OFSITE_PSYCH_HOSP_CNT, TOT_OFSITE_PSYCH_UNIT_CNT, TOT_OFSITE_REHAB_HOSP_CNT, TOT_OFSITE_REHAB_UNIT_CNT, TOT_OFSITE_URGNT_CARE_CNTR_CNT, OFSITE_LCTN_CNT, OPRTG_ROOM_CNT, ORGNZ_FMLY_MBR_GRP_SW, ORGNZ_RSDNT_GRP_SW, PARENT_PROVIDER_NUMBER, FQHC_APRVD_RHC_SW, MDCR_PRTCPTN_OP_PT_SPCH_SW, PGM_PRTCPTN_CD, PRVDR_BSD_FAC_SW, PRVNC_CD, PSYCH_UNIT_BED_CNT, PSYCH_UNIT_EFCTV_DT, PSYCH_UNIT_SW, PSYCH_UNIT_TRMNTN_CD, PSYCH_UNIT_TRMNTN_DT, REHAB_UNIT_BED_CNT, REHAB_UNIT_EFCTV_DT, REHAB_UNIT_SW, REHAB_UNIT_TRMNTN_CD, REHAB_UNIT_TRMNTN_DT, RELATED_PROVIDER_NUMBER, ACUTE_RNL_DLYS_SRVC_CD, PSYCH_SRVC_CD, HH_AIDE_SRVC_CD, ALCHL_DRUG_SRVC_CD, ANSTHSA_SRVC_CD, APLNC_EQUIP_SRVC_CD, AUDLGY_SRVC_CD, BLOOD_SRVC_OFSITE_RSDNT_SW, BLOOD_SRVC_ONST_NRSDNT_SW, BLOOD_SRVC_ONST_RSDNT_SW, BURN_CARE_UNIT_SRVC_CD, CRDC_CTHRTZTN_LAB_SRVC_CD, OPEN_HRT_SRGRY_SRVC_CD, CARF_IP_REHAB_SRVC_CD, CHMTHRPY_SRVC_CD, CHRPRCTIC_SRVC_CD, CL_SRVC_OFSITE_RSDNT_SW, CL_SRVC_ONST_NRSDNT_SW, CL_SRVC_ONST_RSDNT_SW, CL_SRVC_CD, CRNRY_CARE_UNIT_SRVC_CD, CNSLNG_SRVC_CD, CT_SCAN_SRVC_CD, DNTL_SRVC_CD, DNTL_SRVC_OFSITE_RSDNT_SW, DNTL_SRVC_ONST_NRSDNT_SW, DNTL_SRVC_ONST_RSDNT_SW, SHCK_TRMA_SRVC_CD, DGNSTC_RDLGY_SRVC_CD, DTRY_SRVC_CD, DTRY_OFSITE_RSDNT_SW, DTRY_ONST_NRSDNT_SW, DTRY_ONST_RSDNT_SW, DCTD_ER_SRVC_CD, EMER_PSYCH_SRVC_CD, XTRCRPRL_SHCK_LTHTRPTR_SRVC_CD, FRNSC_PSYCH_SRVC_CD, GRTRC_PSYCH_SRVC_CD, GRNTLGCL_SPCLTY_SRVC_CD, SP_HOME_TRNG_SPRT_HD_SW, HMDLYS_SRVC_SW, HMMKR_SRVC_CD, HSEKPNG_SRVC_OFSITE_RSDNT_SW, HSEKPNG_SRVC_ONST_NRSDNT_SW, HSEKPNG_SRVC_ONST_RSDNT_SW, IP_SRGCL_SRVC_CD, INTRN_RSDNT_SRVC_CD, MDCL_SCL_SRVC_CD, MDCL_SUPLY_SRVC_CD, ICU_SRVC_CD, MDCR_TRNSPLNT_CNTR_SRVC_CD, MENTL_HLTH_OFSITE_RSDNT_SW, MENTL_HLTH_ONST_NRSDNT_SW, MENTL_HLTH_ONST_RSDNT_SW, MGNTC_RSNC_IMG_SRVC_CD, NEONTL_ICU_SRVC_CD, NEONTL_NRSRY_SRVC_CD, NRSRGCL_SRVC_CD, ORGN_TRNSPLNT_SRVC_CD, NUCLR_MDCN_SRVC_CD, NRSNG_SRVC_EMPLEE_SW, NRSNG_SRVC_CNTRCTR_SW, NRSNG_SRVC_ARNGMT_SW, NRSNG_SRVC_CD, NRSNG_SRVC_OFSITE_RSDNT_SW, NRSNG_SRVC_ONST_NRSDNT_SW, NRSNG_SRVC_ONST_RSDNT_SW, NTRTNL_GDNC_SRVC_CD, OB_SRVC_CD, OPTHLMC_SRGY_SRVC_CD, OPTMTRC_SRVC_CD, OPRTG_ROOM_SRVC_CD, ORTHPDC_SRGY_SRVC_CD, ORTHTC_PRSTHTC_EMPLEE_SW, ORTHTC_PRSTHTC_CNTRCTR_SW, ORTHTC_PRSTHTC_ARNGMT_SW, OT_EMPLEE_SW, OT_CNTRCTR_SW, OT_ARNGMT_SW, OT_SRVC_CD, OT_SRVC_OFSITE_RSDNT_SW, OT_SRVC_ONST_NRSDNT_SW, OT_SRVC_ONST_RSDNT_SW, OTHR_SRVC_CD, OP_SRVC_CD, OP_PSYCH_SRVC_CD, OP_REHAB_SRVC_CD, OP_SRGRY_UNIT_SRVC_CD, PED_SRVC_CD, PED_ICU_SRVC_CD, SP_HOME_TRNG_SPRT_PD_SW, PRTNL_DLYS_SRVC_SW, PET_SCAN_SRVC_CD, PHRMCY_SRVC_OFSITE_RSDNT_SW, PHRMCY_SRVC_ONST_NRSDNT_SW, PHRMCY_SRVC_ONST_RSDNT_SW, PHYSN_EMPLEE_SW, PHYSN_CNTRCTR_SW, PHYSN_ARNGMT_SW, PHYSN_SRVC_CD, PHYSN_EXT_SRVC_OFSITE_RSDNT_SW, PHYSN_EXT_SRVC_ONST_NRSDNT_SW, PHYSN_EXT_SRVC_ONST_RSDNT_SW, PHYSN_SRVC_OFSITE_RSDNT_SW, PHYSN_SRVC_ONST_NRSDNT_SW, PHYSN_SRVC_ONST_RSDNT_SW, PDTRY_SRVC_OFSITE_RSDNT_SW, PDTRY_SRVC_ONST_NRSDNT_SW, PDTRY_SRVC_ONST_RSDNT_SW, PSTOPRTV_RCVRY_SRVC_CD, CHLD_ADLSCNT_PSYCH_SRVC_CD, PSYCHLGCL_EMPLEE_SW, PSYCHLGCL_CNTRCTR_SW, PSYCHLGCL_ARNGMT_SW, PT_EMPLEE_SW, PT_CNTRCTR_SW, PT_ARNGMT_SW, PT_SRVC_CD, PT_OFSITE_RSDNT_SW, PT_ONST_NRSDNT_SW, PT_ONST_RSDNT_SW, RCNSTRCTN_SRGY_SRVC_CD, RSPRTRY_CARE_EMPLEE_SW, RSPRTRY_CARE_CNTRCTR_SW, RSPRTRY_CARE_ARNGMT_SW, RSPRTRY_CARE_SRVC_CD, SHRT_TERM_IP_SRVC_CD, SCL_EMPLEE_SW, SCL_CNTRCTR_SW, SCL_ARNGMT_SW, SCL_SRVC_CD, SCL_WORK_SRVC_OFSITE_RSDNT_SW, SCL_WORK_SRVC_ONST_NRSDNT_SW, SCL_WORK_SRVC_ONST_RSDNT_SW, SPCH_PTHLGY_EMPLEE_SW, SPCH_PTHLGY_CNTRCTR_SW, SPCH_PTHLGY_ARNGMT_SW, SPCH_PTHLGY_SRVC_CD, SPCH_PTHLGY_OFSITE_RSDNT_SW, SPCH_PTHLGY_ONST_NRSDNT_SW, SPCH_PTHLGY_ONST_RSDNT_SW, SPCH_THRPY_SRVC_CD, SRGCL_ICU_SRVC_CD, ACTVTY_OTHR_OFSITE_RSDNT_SW, ACTVTY_OTHR_ONST_NRSDNT_SW, ACTVTY_OTHR_ONST_RSDNT_SW, SCL_SRVC_OTHR_OFSITE_RSDNT_SW, SCL_SRVC_OTHR_ONST_NRSDNT_SW, SCL_SRVC_OTHR_ONST_RSDNT_SW, ACTVTY_OFSITE_RSDNT_SW, ACTVTY_ONST_NRSDNT_SW, ACTVTY_ONST_RSDNT_SW, THRPTC_RDLGY_SRVC_CD, THRPTC_RCRTNL_OFSITE_RSDNT_SW, THRPTC_RCRTNL_ONST_NRSDNT_SW, THRPTC_RCRTNL_ONST_RSDNT_SW, URGNT_CARE_SRVC_CD, VCTNL_GDNC_SRVC_CD, VCTNL_SRVC_OFSITE_RSDNT_SW, VCTNL_SRVC_ONST_NRSDNT_SW, VCTNL_SRVC_ONST_RSDNT_SW, DGNSTC_XRAY_OFSITE_RSDNT_SW, DGNSTC_XRAY_ONST_NRSDNT_SW, DGNSTC_XRAY_ONST_RSDNT_SW, ACUTE_RESP_CARE_CD, OVRRD_STFG_SW, PROFNL_ADMIN_CNTRCT_CNT, PROFNL_ADMIN_FLTM_CNT, PROFNL_ADMIN_PRTM_CNT, HH_AIDE_EMPLEE_CNT, HH_AIDE_VLNTR_CNT, PRSNEL_OTHR_CNT, NRS_AIDE_CNTRCT_CNT, NRS_AIDE_FLTM_CNT, NRS_AIDE_PRTM_CNT, CNSLR_EMPLEE_CNT, CNSLR_VLNTR_CNT, CRNA_CNT, DNTST_CNTRCT_CNT, DNTST_FLTM_CNT, DNTST_PRTM_CNT, DIETN_CNT, DIETN_CNTRCT_CNT, DIETN_FLTM_CNT, DIETN_PRTM_CNT, DRCT_CARE_PRSNEL_CNT, FOOD_SRVC_CNTRCT_CNT, FOOD_SRVC_FLTM_CNT, FOOD_SRVC_PRTM_CNT, HH_AIDE_CNT, HMMKR_EMPLEE_CNT, HMMKR_VLNTR_CNT, HSEKPNG_CNTRCT_CNT, HSEKPNG_FLTM_CNT, HSEKPNG_PRTM_CNT, LAB_TCHNCN_CNT, LPN_CNT, LPN_LVN_CNT, LPN_LVN_CNTRCT_CNT, LPN_LVN_FLTM_CNT, LPN_LVN_PRTM_CNT, LPN_LVN_VLNTR_CNT, MDCL_DRCTR_CNTRCT_CNT, MDCL_DRCTR_FLTM_CNT, MDCL_DRCTR_PRTM_CNT, MDCL_SCL_WORKR_CNT, MDCL_SCL_WORKR_VLNTR_CNT, MDCL_TCHNLGST_CNT, MDCTN_AIDE_CNTRCT_CNT, MDCTN_AIDE_FLTM_CNT, MDCTN_AIDE_PRTM_CNT, MENTL_HLTH_SRVC_CNTRCT_CNT, MENTL_HLTH_SRVC_FLTM_CNT, MENTL_HLTH_SRVC_PRTM_CNT, NUCLR_MDCN_TCHNCN_CNT, NAT_CNTRCT_CNT, NAT_FLTM_CNT, NAT_PRTM_CNT, NRS_PRCTNR_CNT, NRS_ADMINV_CNTRCT_CNT, NRS_ADMINV_FLTM_CNT, NRS_ADMINV_PRTM_CNT, OCPTNL_THRPST_CNT, OCPTNL_THRPST_CNTRCT_CNT, OCPTNL_THRPST_FLTM_CNT, OCPTNL_THRPST_PRTM_CNT, OT_AIDE_CNTRCT_CNT, OT_AIDE_FLTM_CNT, OT_AIDE_PRTM_CNT, OT_ASTNT_CNTRCT_CNT, OT_ASTNT_FLTM_CNT, OT_ASTNT_PRTM_CNT, VLNTR_OTHR_CNT, ACTVTY_STF_OTHR_CNTRCT_CNT, ACTVTY_STF_OTHR_FLTM_CNT, ACTVTY_STF_OTHR_PRTM_CNT, PHYSN_OTHR_CNTRCT_CNT, PHYSN_OTHR_FLTM_CNT, PHYSN_OTHR_PRTM_CNT, SCL_SRVC_OTHR_STF_CNTRCT_CNT, SCL_SRVC_OTHR_STF_FLTM_CNT, SCL_SRVC_OTHR_STF_PRTM_CNT, STF_OTHR_CNTRCT_CNT, STF_OTHR_FLTM_CNT, STF_OTHR_PRTM_CNT, PHRMCST_CNTRCT_CNT, PHRMCST_FLTM_CNT, PHRMCST_PRTM_CNT, PHYS_THRPST_CNTRCT_CNT, PHYS_THRPST_FLTM_CNT, PHYS_THRPST_PRTM_CNT, PHYSN_CNT, PHYSN_VLNTR_CNT, PHYSN_ASTNT_CNT, PHYSN_EXT_CNTRCT_CNT, PHYSN_EXT_FLTM_CNT, PHYSN_EXT_PRTM_CNT, RSDNT_PHYSN_CNT, PDTRST_CNTRCT_CNT, PDTRST_FLTM_CNT, PDTRST_PRTM_CNT, PSYCHLGST_CNT, PHYS_THRPST_STF_CNT, PHYS_THRPST_CNT, PHYS_THRPST_ARNGMT_CNT, PT_AIDE_CNTRCT_CNT, PT_AIDE_FLTM_CNT, PT_AIDE_PRTM_CNT, PT_ASTNT_CNTRCT_CNT, PT_ASTNT_FLTM_CNT, PT_ASTNT_PRTM_CNT, ACTVTY_PROFNL_CNTRCT_CNT, ACTVTY_PROFNL_FLTM_CNT, ACTVTY_PROFNL_PRTM_CNT, RDLGY_TCHNCN_CNT, REG_PHRMCST_CNT, INHLTN_THRPST_CNT, RN_CNT, RN_CNTRCT_CNT, RN_FLTM_CNT, RN_PRTM_CNT, RN_VLNTR_CNT, RN_DRCTR_CNTRCT_CNT, RN_DRCTR_FLTM_CNT, RN_DRCTR_PRTM_CNT, SCL_WORKR_CNT, SCL_WORKR_CNTRCT_CNT, SCL_WORKR_FLTM_CNT, SCL_WORKR_PRTM_CNT, SPCH_PTHLGST_ARNGMT_CNT, SPCH_PTHLGST_CNTRCT_CNT, SPCH_PTHLGST_FLTM_CNT, SPCH_PTHLGST_PRTM_CNT, SPCH_PTHLGST_CNT, SPCH_PTHLGST_AUDLGST_CNT, TCHNCL_STF_NUM, TCHNCN_CNT, THRPTC_RCRTNL_CNTRCT_CNT, THRPTC_RCRTNL_FLTM_CNT, THRPTC_RCRTNL_PRTM_CNT, EMPLEE_CNT, VLNTR_CNT, SBUNIT_CNT, SBUNIT_SW, SBUNIT_OPRTN_SW, DNTL_SRGRY_SW, OTLRYNGLGY_SRGRY_SW, ENDSCPY_SRGRY_SW, OB_GYN_SRGRY_SW, OPTHMLGY_SRGRY_SW, ORTHPDC_SRGRY_SW, OTHR_SRGRY_SW, PAIN_SRGRY_SW, PLSTC_SRGRY_SW, FT_SRGRY_SW, SB_SW, SB_SIZE_CD, TCHNLGST_2_YR_RDLGC_CNT, TCHNLGST_ASCT_DGR_CNT, TCHNLGST_BS_BA_DGR_CNT, DLYS_STN_CNT
        //}

        //public void importProviderOfServicesOther(string file)
        //{
        //    using (var parser = new TextFieldParser(file)) {
        //        parser.TextFieldType = FieldType.Delimited;
        //        parser.SetDelimiters(getColumnDelimiter());
        //        parser.HasFieldsEnclosedInQuotes = true;

        //        // read the headers stored on the first line
        //        var headers = parser.ReadFields();

        //        Dictionary<ProviderOfServicesOtherHeader, int> headerLines;

        //        if (!checkHeadersProviderOfServicesOther(headers, out headerLines)) {
        //            WriteLine(DEFAULT_FAILED_HEADER_CHECK_RESPONSE);

        //            // stop processing
        //            return;
        //        }

        //        var counter = seekToDataLine(parser);

        //        while (!parser.EndOfData) {
        //            //Processing row
        //            string[] fields = parser.ReadFields();

        //            try {
        //                processProviderOfServicesOther(fields, ++counter);
        //            }
        //            catch (Exception ex) {
        //                WriteLine(ex.ToString());

        //                WriteLine("Data trying to add:");
        //                WriteLine(string.Join(",", fields));
        //            }

        //            if (interrupt)
        //                break;

        //            while (pause)
        //                Thread.Sleep(DEFAULT_PAUSE_SLEEP_TIME);
        //        }
        //    }
        //}

        //public void processProviderOfServicesOther(string[] data, int counter)
        //{
        //    using (var medicareDatabase = new MedicareEntities()) {
        //        medicareDatabase.S

        //        medicareDatabase.SaveChanges();

        //        WriteLine(string.Format("#{2}\t{0}\t{1}\t{3}\t{4}", payment.npi, exists ? "Updated" : "Added", counter, year, hcpcs_code));
        //    }
        //}

        //private bool checkHeadersProviderOfServicesOther(string[] headers,
        //    out Dictionary<ProviderOfServicesOtherHeader, int> headerIndexes)
        //{
        //    headerIndexes = new Dictionary<ProviderOfServicesOtherHeader, int>();

        //    for (var i = 0; i <= headers.Length; ++i) {
        //        ProviderOfServicesOtherHeader header;

        //        if (Enum.TryParse(headers[i], out header)) {
        //            headerIndexes.Add(header, i);
        //        }
        //    }

        //    return headerIndexes.Count == Enum.GetNames(typeof(ProviderOfServicesOtherHeader)).Length;
        //}

        //#endregion

        #region Taxonomy Codes

        public void importTaxonomyCodes(string file) {
            using (var parser = new TextFieldParser(file)) {
                parser.TextFieldType = FieldType.Delimited;
                parser.SetDelimiters(getColumnDelimiter());
                parser.HasFieldsEnclosedInQuotes = true;

                // read the headers stored on the first line
                var headers = parser.ReadFields();

                //WriteLine(string.Join(",", headers.Select(header => string.Format("\"{0}\"", header)))); return;

                //for (var i = 0; i < headers.Count(); ++i) { WriteLine(string.Format(
                //    "if (!string.IsNullOrWhiteSpace(data[{1}])) taxonomyCode.{0} = data[{1}].Trim();",
                //    headers[i].Replace(' ', '_'), i)); } return;

                if (!checkHeadersTaxonomyCodes(headers)) {
                    WriteLine(DEFAULT_FAILED_HEADER_CHECK_RESPONSE);

                    // stop processing
                    return;
                }

                var counter = seekToDataLine(parser);

                while (!parser.EndOfData) {
                    //Processing row
                    string[] fields = parser.ReadFields();

                    try {
                        processRowTaxonomyCode(fields, ++counter);
                    }
                    catch (Exception ex) {
                        WriteLine(ex.ToString());

                        WriteLine("Data trying to add:");
                        WriteLine(string.Join(",", fields));
                    }

                    if (interrupt)
                        break;

                    while (pause)
                        Thread.Sleep(DEFAULT_PAUSE_SLEEP_TIME);
                }
            }
        }

        private void processRowTaxonomyCode(string[] data, int counter) {
            using (var medicareDatabase = new MedicareEntities()) {
                string code = data[0];

                if (string.IsNullOrWhiteSpace(code))
                    return;

                var taxonomyCode = medicareDatabase.TaxonomyCodes.Find(code);

                var exists = taxonomyCode != null;

                if (!exists) { // new
                    taxonomyCode = new TaxonomyCode { Code = code };

                    medicareDatabase.TaxonomyCodes.Add(taxonomyCode);
                }

                if (!string.IsNullOrWhiteSpace(data[1])) taxonomyCode.Grouping = data[1].Trim();
                if (!string.IsNullOrWhiteSpace(data[2])) taxonomyCode.Classification = data[2].Trim();
                if (!string.IsNullOrWhiteSpace(data[3])) taxonomyCode.Specialization = data[3].Trim();
                if (!string.IsNullOrWhiteSpace(data[4])) taxonomyCode.Definition = data[4].Trim();
                if (!string.IsNullOrWhiteSpace(data[5])) taxonomyCode.Notes = data[5].Trim();

                medicareDatabase.SaveChanges();

                WriteLine(string.Format("#{2}\t{0}\t{1}", taxonomyCode.Code, exists ? "Updated" : "Added", counter));
            }
        }

        private bool checkHeadersTaxonomyCodes(string[] headers) {
            string[] sources = new string[] { "Code", "Grouping", "Classification", "Specialization", "Definition", "Notes" };

            return HeaderComparer.checkHeaders(sources, headers);
        }

        #endregion

        class HeaderComparer : IEqualityComparer<string>
        {
            bool IEqualityComparer<string>.Equals(string x, string y)
            {
                return string.Equals(x, y, StringComparison.InvariantCultureIgnoreCase);
            }

            int IEqualityComparer<string>.GetHashCode(string obj)
            {
                throw new NotImplementedException();
            }

            public static bool checkHeaders(string[] source, string[] match)
            {
                return source.SequenceEqual(match, new HeaderComparer());
            }
        }

        private void Write(string text) {
            if (checkBoxOutputOneLine.Checked) {
                textBoxOutput.Text = text;
                return;
            }

            Invoke((Action)(() => {
                textBoxOutput.AppendText(text);
            }));
        }

        private void WriteLine(string text) {
            Write(string.Format("{0}{1}", text, Environment.NewLine));
        }

        private void Reset(bool clearOutput = true) {
            interrupt = false;
            pause = false;

            if (clearOutput)
                textBoxOutput.ResetText();

            buttonRun.Enabled = true;
            buttonStop.Enabled = false;
            buttonPause.Enabled = false;

            buttonPause.Text = "Pause";
        }

        private string getColumnDelimiter() {
            string delimiter = null;

            Invoke((Action)(() => {
                switch (comboBoxColumnDelimiters.SelectedItem.ToString()) {
                    case "Comma {,}":
                        delimiter = ",";
                        break;
                    case "Tab {t}":
                        delimiter = "\t";
                        break;
                }
            }));

            return delimiter;
        }

        private short getDataYear() {
            short year = 0;

            if (!string.IsNullOrWhiteSpace(textBoxDataYear.Text)) {
                Invoke((Action)(() => {
                    year = short.Parse(textBoxDataYear.Text);
                }));
            }

            return year;
        }

        private void buttonRun_Click(object sender, EventArgs e) {
            Reset();

            buttonRun.Enabled = false;
            buttonStop.Enabled = true;
            buttonPause.Enabled = true;

            try {
                backgroundWorker1.RunWorkerAsync(comboBoxTypes.SelectedItem);
            }
            catch (Exception ex) {
                WriteLine(ex.ToString());
            }
        }

        private void buttonStop_Click(object sender, EventArgs e) {
            pause = false;
            interrupt = true;

            WriteLine("Stop requested!");
        }

        private void backgroundWorker1_DoWork(object sender, DoWorkEventArgs e) {
            var fileType = e.Argument.ToString();
            var filePath = textBoxFile.Text;

            switch (fileType) {
                case "NPI":
                    importNPI(filePath);
                    break;
                case "Physicians":
                    importPhysicians(filePath);
                    break;
                case "Aggregates":
                    importAggregates(filePath);
                    break;
                case "Utilization & Payments":
                    importUtilizationAndPayments(filePath);
                    break;
                case "Taxonomy Codes":
                    importTaxonomyCodes(filePath);
                    break;
                default:
                    WriteLine(string.Format("Could not determine file type '{0}'!", fileType));
                    break;
            }

            Invoke((Action)(() => {
                Reset(clearOutput: false);
                WriteLine("done");
            }));
        }

        private void buttonPause_Click(object sender, EventArgs e) {
            pause = !pause;

            if (pause) {
                WriteLine("Pausing...");
                buttonPause.Text = "Resume";
            } else {
                WriteLine("Resuming...");
                buttonPause.Text = "Pause";
            }
        }

        private void label6_Click(object sender, EventArgs e)
        {

        }
    }
}
