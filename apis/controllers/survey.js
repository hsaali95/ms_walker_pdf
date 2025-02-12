const puppeteer = require("puppeteer");
const supabase = require("../../utils/supabase-client");
const moment  = require("moment")
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
      const htmlContent = `
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
              ? `<h3>Date: from ${moment(startDate).format("DD/MM/YYYY")} to ${
                  endDate
                    ? moment(endDate).format("DD/MM/YYYY")
                    : moment().format("DD/MM/YYYY")
                }</h3>`
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
            <tbody>
              ${
                Array.isArray(data)
                  ? data
                      .map(
                        (row) => `
                        <tr>
                          <td>${row.id || "-"}</td>
                          <td>${
                            row?.created_at
                              ? moment(row.created_at).format("DD/MM/YYYY")
                              : "-"
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
                                            SURVEY_IMAGE_BASE_URL +
                                            file.file.path
                                          }" target="_blank">View Image ${
                                            i + 1
                                          }</a>`
                                        : "-"
                                    )
                                    .join("<br />")
                                : "-"
                            }
                          </td>
                        </tr>
                      `
                      )
                      .join("")
                  : ""
              }
            </tbody>
          </table>
        </body>
      </html>
    `;
      // Launch a headless browser
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set the HTML content
      await page.setContent(htmlContent, {
        waitUntil: "networkidle0", // Wait for all network requests to complete
      });

      // Generate PDF buffer
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      await browser.close();

      // Upload the PDF to Supabase
      const { error: uploadError } = await supabase.storage
        .from("mas-walker-file")
        .upload(uniqueFileName, pdfBuffer, { contentType: "application/pdf" });

      if (uploadError) {
        throw new Error("Failed to upload file to Supabase");
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("mas-walker-file")
        .getPublicUrl(uniqueFileName);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Failed to generate public URL for the uploaded file");
      }

      return res.status(200).send({ publicUrlData });
    } catch (error) {
      next(error); // Pass error to middleware
    }
  },
};

module.exports = surveyController;
