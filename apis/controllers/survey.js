const puppeteer = require("puppeteer");
const supabase = require("../../utils/supabase-client");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
// Convert Web Streams API to a Node.js stream
var wkhtmltopdf = require("wkhtmltopdf");
const surveyController = {
  async generatePdf(req, res, next) {
    try {
      const {
        data,
        SURVEY_IMAGE_BASE_URL,
        uniqueFileName,
        startDate,
        endDate,
        MsWalkerLogoBase64,
      } = req.body;
      const dirPath = path.join(__dirname, `../../files`);
      const filePath = path.join(
        __dirname,
        `../../files/large-file-${new Date()
          .toISOString()
          .replaceAll(":", "-")}.html`
      );

      // Ensure directory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // Creates nested directories if needed
      }

      const writeStream = fs.createWriteStream(filePath);

      const topContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #4F131F; color: white; border: 1px solid #4F131F; padding: 8px; text-align: left; }
            td { border: 1px solid #4F131F; padding: 8px; text-align: left; }
            h2 { color: #4F131F; text-align: center; }
            h3 { color: #4F131F; text-align: right; }
            a { color: #4F131F; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="data:image/png;base64,${MsWalkerLogoBase64}" alt="Survey Logo" style="width: 300px;" />
          </div>
          <h2>Report</h2>
        ${
          startDate
            ? `<h3>Date: from ${startDate} to ${
                endDate
                  ? endDate // Correct usage
                  : moment().format("DD/MM/YYYY")
              } </h3>`
            : ""
        }

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Customer Number</th>
                <th>Customer City</th>
                <th>Display Type</th>
                <th>Supplier Name</th>
                <th>Item Name</th>
                <th>Status</th>
                <th># of Cases</th>
                <th>Display Cost</th>
                <th>Images Links</th>
              </tr>
            </thead>
            <tbody>`;

      writeStream.write(topContent);

      const getContent = (row, index) =>
        `<tr>
        <td>${row.id || "-"}</td>
        <td>${
          row?.created_at ? moment(row.created_at).format("DD/MM/YYYY") : "-"
        }</td>
        <td>${row?.account?.fullCustomerInfo || "-"}</td>
        <td>${row?.account?.custNumber || "-"}</td>
        <td>${row?.account?.city || "-"}</td>
        <td>${row?.display?.display_type || "-"}</td>
        <td>${row?.supplier?.["Vendor Name"] || "-"}</td>
        <td>${row?.item?.ItemFullInfo || "-"}</td>
        <td>${row?.survey_status?.status || "-"}</td>
        <td>${row?.number_of_cases || "-"}</td>
        <td>${row?.display_coast || "-"}</td>
        <td>
          ${
            Array.isArray(row.survey_file)
              ? row.survey_file
                  .map((file, i) =>
                    file?.file?.path
                      ? `<a href="${
                          SURVEY_IMAGE_BASE_URL + file.file.path
                        }" target="_blank">View Image ${i + 1}</a>`
                      : "-"
                  )
                  .join("<br />")
              : "-"
          }
        </td>
      </tr>
      ${index + 1 === row.length ? `</tbody> </table> </body> </html>` : ``}
    `;

      let index = 0;
      function write() {
        let ok = true;

        while (index < data.length && ok) {
          ok = writeStream.write(getContent(data[index], index));
          index++;
        }

        if (index < data.length) {
          writeStream.once("drain", write); // Wait for buffer to empty
        } else {
          writeStream.end(() => console.log("File writing completed."));
        }
      }

      write();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="streamed-document.pdf"'
      );

      var stream = wkhtmltopdf(fs.createReadStream(filePath));
      stream.pipe(res);
    } catch (error) {
      console.log(error);
      next(error); // Pass error to middleware
    }
  },
};

module.exports = surveyController;
