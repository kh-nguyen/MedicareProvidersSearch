namespace Import
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing) {
            if (disposing && (components != null)) {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent() {
            this.textBoxOutput = new System.Windows.Forms.TextBox();
            this.buttonRun = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.comboBoxTypes = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.openFileDialog1 = new System.Windows.Forms.OpenFileDialog();
            this.textBoxFile = new System.Windows.Forms.TextBox();
            this.buttonSelect = new System.Windows.Forms.Button();
            this.buttonStop = new System.Windows.Forms.Button();
            this.backgroundWorker1 = new System.ComponentModel.BackgroundWorker();
            this.label3 = new System.Windows.Forms.Label();
            this.comboBoxColumnDelimiters = new System.Windows.Forms.ComboBox();
            this.label4 = new System.Windows.Forms.Label();
            this.textBoxDataYear = new System.Windows.Forms.TextBox();
            this.buttonPause = new System.Windows.Forms.Button();
            this.label5 = new System.Windows.Forms.Label();
            this.textBoxLineNumberStart = new System.Windows.Forms.TextBox();
            this.textBoxCpuThreads = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // textBoxOutput
            // 
            this.textBoxOutput.Location = new System.Drawing.Point(12, 80);
            this.textBoxOutput.Multiline = true;
            this.textBoxOutput.Name = "textBoxOutput";
            this.textBoxOutput.ReadOnly = true;
            this.textBoxOutput.Size = new System.Drawing.Size(675, 252);
            this.textBoxOutput.TabIndex = 0;
            // 
            // buttonRun
            // 
            this.buttonRun.Location = new System.Drawing.Point(590, 54);
            this.buttonRun.Name = "buttonRun";
            this.buttonRun.Size = new System.Drawing.Size(50, 23);
            this.buttonRun.TabIndex = 1;
            this.buttonRun.Text = "Import";
            this.buttonRun.UseVisualStyleBackColor = true;
            this.buttonRun.Click += new System.EventHandler(this.buttonRun_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(9, 54);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(31, 13);
            this.label1.TabIndex = 3;
            this.label1.Text = "Type";
            // 
            // comboBoxTypes
            // 
            this.comboBoxTypes.FormattingEnabled = true;
            this.comboBoxTypes.Location = new System.Drawing.Point(46, 54);
            this.comboBoxTypes.Name = "comboBoxTypes";
            this.comboBoxTypes.Size = new System.Drawing.Size(121, 21);
            this.comboBoxTypes.TabIndex = 2;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(174, 54);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(23, 13);
            this.label2.TabIndex = 4;
            this.label2.Text = "File";
            // 
            // openFileDialog1
            // 
            this.openFileDialog1.FileName = "openFileDialog1";
            // 
            // textBoxFile
            // 
            this.textBoxFile.Location = new System.Drawing.Point(204, 54);
            this.textBoxFile.Name = "textBoxFile";
            this.textBoxFile.Size = new System.Drawing.Size(266, 20);
            this.textBoxFile.TabIndex = 5;
            // 
            // buttonSelect
            // 
            this.buttonSelect.Location = new System.Drawing.Point(476, 54);
            this.buttonSelect.Name = "buttonSelect";
            this.buttonSelect.Size = new System.Drawing.Size(52, 23);
            this.buttonSelect.TabIndex = 6;
            this.buttonSelect.Text = "Browse";
            this.buttonSelect.UseVisualStyleBackColor = true;
            this.buttonSelect.Click += new System.EventHandler(this.buttonSelect_Click);
            // 
            // buttonStop
            // 
            this.buttonStop.Location = new System.Drawing.Point(646, 54);
            this.buttonStop.Name = "buttonStop";
            this.buttonStop.Size = new System.Drawing.Size(41, 23);
            this.buttonStop.TabIndex = 7;
            this.buttonStop.Text = "Stop";
            this.buttonStop.UseVisualStyleBackColor = true;
            this.buttonStop.Click += new System.EventHandler(this.buttonStop_Click);
            // 
            // backgroundWorker1
            // 
            this.backgroundWorker1.DoWork += new System.ComponentModel.DoWorkEventHandler(this.backgroundWorker1_DoWork);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(136, 24);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(85, 13);
            this.label3.TabIndex = 8;
            this.label3.Text = "Column Delimiter";
            // 
            // comboBoxColumnDelimiters
            // 
            this.comboBoxColumnDelimiters.FormattingEnabled = true;
            this.comboBoxColumnDelimiters.Location = new System.Drawing.Point(228, 16);
            this.comboBoxColumnDelimiters.Name = "comboBoxColumnDelimiters";
            this.comboBoxColumnDelimiters.Size = new System.Drawing.Size(121, 21);
            this.comboBoxColumnDelimiters.TabIndex = 9;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(358, 23);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(55, 13);
            this.label4.TabIndex = 10;
            this.label4.Text = "Data Year";
            // 
            // textBoxDataYear
            // 
            this.textBoxDataYear.Location = new System.Drawing.Point(418, 16);
            this.textBoxDataYear.Name = "textBoxDataYear";
            this.textBoxDataYear.Size = new System.Drawing.Size(83, 20);
            this.textBoxDataYear.TabIndex = 11;
            // 
            // buttonPause
            // 
            this.buttonPause.Location = new System.Drawing.Point(534, 54);
            this.buttonPause.Name = "buttonPause";
            this.buttonPause.Size = new System.Drawing.Size(50, 23);
            this.buttonPause.TabIndex = 12;
            this.buttonPause.Text = "Pause";
            this.buttonPause.UseVisualStyleBackColor = true;
            this.buttonPause.Click += new System.EventHandler(this.buttonPause_Click);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(511, 23);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(70, 13);
            this.label5.TabIndex = 13;
            this.label5.Text = "Start at line #";
            // 
            // textBoxLineNumberStart
            // 
            this.textBoxLineNumberStart.Location = new System.Drawing.Point(585, 17);
            this.textBoxLineNumberStart.Name = "textBoxLineNumberStart";
            this.textBoxLineNumberStart.Size = new System.Drawing.Size(100, 20);
            this.textBoxLineNumberStart.TabIndex = 14;
            // 
            // textBoxCpuThreads
            // 
            this.textBoxCpuThreads.Location = new System.Drawing.Point(82, 17);
            this.textBoxCpuThreads.Name = "textBoxCpuThreads";
            this.textBoxCpuThreads.Size = new System.Drawing.Size(39, 20);
            this.textBoxCpuThreads.TabIndex = 16;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(9, 24);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(71, 13);
            this.label6.TabIndex = 15;
            this.label6.Text = "CPU Threads";
            this.label6.Click += new System.EventHandler(this.label6_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(699, 344);
            this.Controls.Add(this.textBoxCpuThreads);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.textBoxLineNumberStart);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.buttonPause);
            this.Controls.Add(this.textBoxDataYear);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.comboBoxColumnDelimiters);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.buttonStop);
            this.Controls.Add(this.buttonSelect);
            this.Controls.Add(this.textBoxFile);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.comboBoxTypes);
            this.Controls.Add(this.buttonRun);
            this.Controls.Add(this.textBoxOutput);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox textBoxOutput;
        private System.Windows.Forms.Button buttonRun;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox comboBoxTypes;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.OpenFileDialog openFileDialog1;
        private System.Windows.Forms.TextBox textBoxFile;
        private System.Windows.Forms.Button buttonSelect;
        private System.Windows.Forms.Button buttonStop;
        private System.ComponentModel.BackgroundWorker backgroundWorker1;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.ComboBox comboBoxColumnDelimiters;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox textBoxDataYear;
        private System.Windows.Forms.Button buttonPause;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox textBoxLineNumberStart;
        private System.Windows.Forms.TextBox textBoxCpuThreads;
        private System.Windows.Forms.Label label6;
    }
}

