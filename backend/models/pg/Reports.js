const generateOfficialReport = (overview, departments) => {
    const printWindow = window.open('', '_blank');
    const now = new Date();
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Form IV - ${now.getFullYear()}</title>
          <style>
            body { font-family: 'Times New Roman', serif; line-height: 1.4; padding: 20px; }
            .tbl { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .tbl th, .tbl td { border: 1px solid #000; padding: 8px; font-size: 12px; }
            .header { text-align: center; font-weight: bold; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div style="text-align:right">No.IMG/MED/${now.getFullYear()}/${Math.floor(Math.random()*10000)}</div>
          <div class="header">Form - IV <br> ANNUAL REPORT</div>
          
          <table class="tbl">
            <tr><th>SI No.</th><th>Particulars</th><th>Details</th></tr>
            <tr><td>1</td><td>Authorised Person</td><td>Dilara Galimkyzy</td></tr>
            <tr><td>2</td><td>Facility Name</td><td>MedVault KTM.0810</td></tr>
            <tr><td>3</td><td>GPS</td><td>9.6814, 76.6439</td></tr>
            <tr><td>4</td><td>Waste Collection Log</td><td>
              <table class="tbl" style="margin:0">
                <tr><th>Dept</th><th>Driver</th><th>Vehicle</th><th>Fullness</th></tr>
                ${departments.map(d => `
                  <tr>
                    <td>${d.name}</td>
                    <td>${d.driver}</td>
                    <td>${d.plate}</td>
                    <td>${d.avgFullness}%</td>
                  </tr>
                `).join('')}
              </table>
            </td></tr>
            <tr><td>5</td><td>Summary</td><td>Total: ${overview.totalContainers} bins. Avg: ${overview.avgFullness}%</td></tr>
          </table>
          
          <div style="margin-top:40px">
            <p>Date: ${now.toLocaleDateString()}</p>
            <p style="text-align:right">Signature: __________________</p>
          </div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };