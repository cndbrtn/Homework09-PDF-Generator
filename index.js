// I hate this project so much node can suck a fart and so can all PDFs
const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require("pdfkit");

const doc = new pdf();


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
  .then(function (response) {
    // ++ error catch for github user input
    if (response.username === "") {
      console.log("Must enter a valid GitHub username.");
      return;
    }
    const queryUrl = `https://api.github.com/users/${response.username}`;
    let starArr = [];
    const arrSum = arr => arr.reduce((a, b) => a + b, 0);
    axios.get(queryUrl).then(res => {

      // axios.get(`https://api.github.com/users/${response.username}/starred`).then(resp => {console.log(resp)})

      axios.get(`https://api.github.com/users/${response.username}/starred`).then(function (response) {
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
      console.log(res.data);
      console.log(`starred url is: ${res.data.starred_url}`);
      console.log(`img url is: ${res.data.avatar_url}`);
      console.log(`!! color is ${response.color}`);
      //make pdf
      doc.pipe(fs.createWriteStream(`pdf/${response.username}_resume.pdf`));
      //style
      doc.rect(0, 0, 700, 300).fill("grey");
      doc.rect(0, 300, 700, 500).fill("darkgrey");
      doc.roundedRect(20, 80, 565, 280, 10).fill(`${response.color}`);
      doc.roundedRect(20, 470, 260, 100, 10).fill(`${response.color}`);
      doc.roundedRect(330, 470, 260, 100, 10).fill(`${response.color}`);
      doc.roundedRect(20, 600, 260, 100, 10).fill(`${response.color}`);
      doc.roundedRect(330, 600, 260, 100, 10).fill(`${response.color}`);
      doc.circle(310, 110, 90).fill("black");
      // doc.image(`${response.data.avatar_url}`, 215, 14, { width: 180 });
      //content
      doc.fontSize(22).text(`My name is ${res.data.name}!`, 50, 250, { align: 'center' }).fill("black");
      doc.fontSize(14).text(`${res.data.location}`, -100, 310, { align: 'center' }).fill("black");
      doc.fontSize(14).text(`GitHub`, 50, 310, { align: 'center' }).fill("black");
      doc.underline(274, 313, 45, 10, { color: 'blue', align: 'center' })
        .link(274, 313, 45, 20, `${res.data.html_url}`);
      doc.fontSize(14).text(`Blog`, 190, 310, { align: 'center' }).fill("black");
      doc.underline(350, 313, 30, 10, { color: 'blue', align: 'center' })
        .link(350, 313, 35, 20, `${res.data.blog}`);
      doc.fontSize(18).text(res.data.bio, 100, 375, {
        width: 410,
        align: 'center'
      });
      doc.fontSize(18).text(`Public repos: \n${res.data.public_repos}`, -220, 500, {
        align: 'center'
      });
      doc.fontSize(18).text(`Stars: \n${arrSum(starArr)}`, -220, 630, {
        align: 'center'
      });
      doc.fontSize(18).text(`Followers: \n${res.data.followers}`, 385, 500, {
        align: 'center'
      });
      doc.fontSize(18).text(`Following: \n${res.data.following}`, 385, 630, {
        align: 'center'
      });

      doc.end();
    }).catch(function (err) {
      console.log(err);
    });
  });
