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
            this.checkBoxOutputOneLine = new System.Windows.Forms.CheckBox();
            this.statusStrip1 = new System.Windows.Forms.StatusStrip();
            this.toolStripStatusLabelProcessingSpeed = new System.Windows.Forms.ToolStripStatusLabel();
            this.toolStripStatusCurrentFile = new System.Windows.Forms.ToolStripStatusLabel();
            this.textBoxQueue = new System.Windows.Forms.TextBox();
            this.buttonEnqueue = new System.Windows.Forms.Button();
            this.buttonDequeue = new System.Windows.Forms.Button();
            this.checkBoxPauseOutput = new System.Windows.Forms.CheckBox();
            this.checkBoxErrorsToFiles = new System.Windows.Forms.CheckBox();
            this.statusStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // textBoxOutput
            // 
            this.textBoxOutput.Location = new System.Drawing.Point(12, 80);
            this.textBoxOutput.Multiline = true;
            this.textBoxOutput.Name = "textBoxOutput";
            this.textBoxOutput.ReadOnly = true;
            this.textBoxOutput.Size = new System.Drawing.Size(458, 211);
            this.textBoxOutput.TabIndex = 0;
            // 
            // buttonRun
            // 
            this.buttonRun.Location = new System.Drawing.Point(476, 268);
            this.buttonRun.Name = "buttonRun";
            this.buttonRun.Size = new System.Drawing.Size(50, 23);
            this.buttonRun.TabIndex = 1;
            this.buttonRun.Text = "Start";
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
            this.buttonStop.Location = new System.Drawing.Point(587, 268);
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
            this.label4.Location = new System.Drawing.Point(549, 23);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(55, 13);
            this.label4.TabIndex = 10;
            this.label4.Text = "Data Year";
            // 
            // textBoxDataYear
            // 
            this.textBoxDataYear.Location = new System.Drawing.Point(609, 16);
            this.textBoxDataYear.Name = "textBoxDataYear";
            this.textBoxDataYear.Size = new System.Drawing.Size(83, 20);
            this.textBoxDataYear.TabIndex = 11;
            // 
            // buttonPause
            // 
            this.buttonPause.Location = new System.Drawing.Point(531, 268);
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
            this.label5.Location = new System.Drawing.Point(364, 24);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(70, 13);
            this.label5.TabIndex = 13;
            this.label5.Text = "Start at line #";
            // 
            // textBoxLineNumberStart
            // 
            this.textBoxLineNumberStart.Location = new System.Drawing.Point(438, 18);
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
            // 
            // checkBoxOutputOneLine
            // 
            this.checkBoxOutputOneLine.AutoSize = true;
            this.checkBoxOutputOneLine.Location = new System.Drawing.Point(12, 302);
            this.checkBoxOutputOneLine.Name = "checkBoxOutputOneLine";
            this.checkBoxOutputOneLine.Size = new System.Drawing.Size(104, 17);
            this.checkBoxOutputOneLine.TabIndex = 17;
            this.checkBoxOutputOneLine.Text = "Output One Line";
            this.checkBoxOutputOneLine.UseVisualStyleBackColor = true;
            // 
            // statusStrip1
            // 
            this.statusStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripStatusLabelProcessingSpeed,
            this.toolStripStatusCurrentFile});
            this.statusStrip1.Location = new System.Drawing.Point(0, 322);
            this.statusStrip1.Name = "statusStrip1";
            this.statusStrip1.Size = new System.Drawing.Size(699, 22);
            this.statusStrip1.TabIndex = 18;
            this.statusStrip1.Text = "statusStrip1";
            // 
            // toolStripStatusLabelProcessingSpeed
            // 
            this.toolStripStatusLabelProcessingSpeed.Name = "toolStripStatusLabelProcessingSpeed";
            this.toolStripStatusLabelProcessingSpeed.Size = new System.Drawing.Size(0, 17);
            // 
            // toolStripStatusCurrentFile
            // 
            this.toolStripStatusCurrentFile.Name = "toolStripStatusCurrentFile";
            this.toolStripStatusCurrentFile.Size = new System.Drawing.Size(0, 17);
            // 
            // textBoxQueue
            // 
            this.textBoxQueue.Location = new System.Drawing.Point(476, 80);
            this.textBoxQueue.Multiline = true;
            this.textBoxQueue.Name = "textBoxQueue";
            this.textBoxQueue.ReadOnly = true;
            this.textBoxQueue.Size = new System.Drawing.Size(211, 182);
            this.textBoxQueue.TabIndex = 19;
            this.textBoxQueue.Text = "Select a file and then use the Enqueue button to add to the queue box before impo" +
    "rting the data using the Start button.";
            // 
            // buttonEnqueue
            // 
            this.buttonEnqueue.Location = new System.Drawing.Point(535, 54);
            this.buttonEnqueue.Name = "buttonEnqueue";
            this.buttonEnqueue.Size = new System.Drawing.Size(75, 23);
            this.buttonEnqueue.TabIndex = 20;
            this.buttonEnqueue.Text = "Enqueue";
            this.buttonEnqueue.UseVisualStyleBackColor = true;
            this.buttonEnqueue.Click += new System.EventHandler(this.buttonEnqueue_Click);
            // 
            // buttonDequeue
            // 
            this.buttonDequeue.Location = new System.Drawing.Point(617, 54);
            this.buttonDequeue.Name = "buttonDequeue";
            this.buttonDequeue.Size = new System.Drawing.Size(75, 23);
            this.buttonDequeue.TabIndex = 21;
            this.buttonDequeue.Text = "Dequeue";
            this.buttonDequeue.UseVisualStyleBackColor = true;
            this.buttonDequeue.Click += new System.EventHandler(this.buttonDequeue_Click);
            // 
            // checkBoxPauseOutput
            // 
            this.checkBoxPauseOutput.AutoSize = true;
            this.checkBoxPauseOutput.Location = new System.Drawing.Point(117, 302);
            this.checkBoxPauseOutput.Name = "checkBoxPauseOutput";
            this.checkBoxPauseOutput.Size = new System.Drawing.Size(91, 17);
            this.checkBoxPauseOutput.TabIndex = 22;
            this.checkBoxPauseOutput.Text = "Pause Output";
            this.checkBoxPauseOutput.UseVisualStyleBackColor = true;
            // 
            // checkBoxErrorsToFiles
            // 
            this.checkBoxErrorsToFiles.AutoSize = true;
            this.checkBoxErrorsToFiles.Checked = true;
            this.checkBoxErrorsToFiles.CheckState = System.Windows.Forms.CheckState.Checked;
            this.checkBoxErrorsToFiles.Location = new System.Drawing.Point(214, 302);
            this.checkBoxErrorsToFiles.Name = "checkBoxErrorsToFiles";
            this.checkBoxErrorsToFiles.Size = new System.Drawing.Size(93, 17);
            this.checkBoxErrorsToFiles.TabIndex = 23;
            this.checkBoxErrorsToFiles.Text = "Errors To Files";
            this.checkBoxErrorsToFiles.UseVisualStyleBackColor = true;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(699, 344);
            this.Controls.Add(this.checkBoxErrorsToFiles);
            this.Controls.Add(this.checkBoxPauseOutput);
            this.Controls.Add(this.buttonDequeue);
            this.Controls.Add(this.buttonEnqueue);
            this.Controls.Add(this.textBoxQueue);
            this.Controls.Add(this.statusStrip1);
            this.Controls.Add(this.checkBoxOutputOneLine);
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
            this.statusStrip1.ResumeLayout(false);
            this.statusStrip1.PerformLayout();
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
        private System.Windows.Forms.CheckBox checkBoxOutputOneLine;
        private System.Windows.Forms.StatusStrip statusStrip1;
        private System.Windows.Forms.ToolStripStatusLabel toolStripStatusLabelProcessingSpeed;
        private System.Windows.Forms.TextBox textBoxQueue;
        private System.Windows.Forms.Button buttonEnqueue;
        private System.Windows.Forms.Button buttonDequeue;
        private System.Windows.Forms.ToolStripStatusLabel toolStripStatusCurrentFile;
        private System.Windows.Forms.CheckBox checkBoxPauseOutput;
        private System.Windows.Forms.CheckBox checkBoxErrorsToFiles;
    }
}

