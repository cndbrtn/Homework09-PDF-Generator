//prompt for github username
//prompt for fav color
//github api
//pdf from results
const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require("html-pdf");
const html = fs.readFileSync("base.html", "utf8")
const options = { format: "Letter" }

// const doc = new pdfDoc();


inquirer
  .prompt([
    {
      type: "input",
      message: "Enter GitHub username",
      name: "username"
    },
    {
      type: "list",
      message: "Favorite color?",
      name: "color",
      choices: ["yellow", "green", "blue", "red", "pink", "grey"]
    }
  ])
  .then(function (responses) {
    // ++ error catch for github user input
    if (responses.username === "") {
      console.log("Must enter a valid GitHub username.");
      return;
    }
    const queryUrl = `https://api.github.com/users/${responses.username}`;
    let starArr = [];
    const arrSum = arr => arr.reduce((a, b) => a + b, 0);
    axios.get(queryUrl).then(resp => {

      // axios.get(`https://api.github.com/users/${responses.username}/starred`).then(resp => {console.log(resp)})

      axios.get(`https://api.github.com/users/${responses.username}/starred`).then(function (response) {
        // console.log(response.data.length); 
        // console.log(response.data[0]); 
        for (let i = 0; i < response.data.length; i++) {
          starArr.push(response.data[i].stargazers_count)
        }
        console.log(`sum is ${arrSum(starArr)}`);
      })
        .catch(function (err) {
          console.log(err);
        });

      //axios call for stars 
      console.log(resp.data);
      console.log(`starred url is: ${resp.data.starred_url}`);
      console.log(`img url is: ${resp.data.avatar_url}`);
      console.log(`!! color is ${responses.color}`);
      //make pdf
      pdf.create(html).toStream(function (err, stream) {
        stream.pipe(fs.createWriteStream(`pdf/${responses.username}_resume.pdf`));

        // .toFile(`pdf/${responses.username}_resume.pdf`, function (err, res) {
        if (err) return console.log(err);
        console.log(res)

      });
      // pdfDoc.pipe(fs.createWriteStream(`pdf/${responses.username}_resume.pdf`));
      // //style
      // pdfDoc.rect(0, 0, 700, 300).fill("grey");
      // pdfDoc.rect(0, 300, 700, 500).fill("darkgrey");
      // pdfDoc.roundedRect(20, 80, 565, 280, 10).fill(`${responses.color}`);
      // pdfDoc.roundedRect(20, 470, 260, 100, 10).fill(`${responses.color}`);
      // pdfDoc.roundedRect(330, 470, 260, 100, 10).fill(`${responses.color}`);
      // pdfDoc.roundedRect(20, 600, 260, 100, 10).fill(`${responses.color}`);
      // pdfDoc.roundedRect(330, 600, 260, 100, 10).fill(`${responses.color}`);
      // // pdfDoc.circle(310, 110, 90).fill("black");
      // // pdfDoc.image("./images/img1.jpg", 215, 14, { width: 180 });
      // //content
      // pdfDoc.fontSize(22).text(`My name is ${resp.data.name}!`, 50, 250, { align: 'center' }).fill("black");
      // pdfDoc.fontSize(14).text(`${resp.data.location}`, -100, 310, { align: 'center' }).fill("black");
      // pdfDoc.fontSize(14).text(`GitHub`, 50, 310, { align: 'center' }).fill("black");
      // pdfDoc.underline(274, 313, 45, 10, { color: 'blue', align: 'center' })
      //   .link(274, 313, 45, 20, `${resp.data.html_url}`);
      // pdfDoc.fontSize(14).text(`Blog`, 190, 310, { align: 'center' }).fill("black");
      // pdfDoc.underline(350, 313, 30, 10, { color: 'blue', align: 'center' })
      //   .link(350, 313, 35, 20, `${resp.data.blog}`);
      // pdfDoc.fontSize(18).text(resp.data.bio, 100, 375, {
      //   width: 410,
      //   align: 'center'
      // });
      // pdfDoc.fontSize(18).text(`Public repos: \n${resp.data.public_repos}`, -220, 500, {
      //   align: 'center'
      // });
      // pdfDoc.fontSize(18).text(`Stars: \n${arrSum(starArr)}`, -220, 630, {
      //   align: 'center'
      // });
      // pdfDoc.fontSize(18).text(`Followers: \n${resp.data.followers}`, 385, 500, {
      //   align: 'center'
      // });
      // pdfDoc.fontSize(18).text(`Following: \n${resp.data.following}`, 385, 630, {
      //   align: 'center'
      // });

      // pdfDoc.end();
    }).catch(function (err) {
      console.log(err);
    });
  });
