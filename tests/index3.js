const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require("html-pdf");
const html = fs.readFileSync("base.html", "utf8")



inquirer
    .prompt([
        {
            type: "input",
            message: "Enter your GitHub username:",
            name: "username"
        },
        {
            type: "list",
            message: "What is your favorite color?",
            name: "color",
            choices: ["green", "yellow", "blue", "pink", "orange"]
        }
    ])
    .then(function (response) {

        if (response.username === "") {
            console.log("Must enter valid username");
            return;
        }
        const queryUrl = `https://api.github.com/users/${response.username}`;
        let starArr = [];
        const arrSum = arr => arr.reduce((a, b) => a + b, 0)

        axios.get(queryUrl).then(function (response) {
            axios.get(`https://api.github.com/users/${response.username}/starred`)
                .then(function (response) {
                    for (let i = 0; i < response.data.length; i++) {
                        starArr.push(response.data[i].stargazers_count)
                    }
                    // console.log(`sum is ${arrSum(starArr)}`);
                })
                .catch(function (err) {
                    console.log(err);
                })
            console.log(response.data);
            // console.log(response.data.location)
            console.log(`starred url is: ${response.data.starred_url}`);
            console.log(`img url is: ${response.data.avatar_url}`);
            console.log(`!! color is ${response.color}`);

            pdf.create(html).toStream(function (err, stream) {
                stream.pipe(fs.createWriteStream(`pdf/${response.username}_resume.pdf`));
                config = {
                    "base": "base.html"
                }

                if (err) return console.log(err);
                // console.log(res)

            });

        });
    });