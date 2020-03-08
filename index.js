const fs = require('fs');
const pdf = require('html-pdf');
const inquirer = require('inquirer');
const axios = require('axios');
const HTML = require('./generateHTML');

inquirer.prompt([
    {
        type: 'input',
        name: 'username',
        message: 'Your GitHub username'
    },
    {
        type: 'list',
        name: 'color',
        choices: ['green', 'blue', 'pink', 'red']
    }
]).then(answer => {
    const queryURL = `https://api.github.com/users/${answer.username}`
    const queryStar = `https://api.github.com/users/${answer.username}/starred`

    axios.get(queryURL).then(res => {
        // console.log(res.data)

        axios.get(queryStar).then(starRes => {
            // console.log('starRes.data', starRes.data.stargazers_count)
            const arr = [];
            function stars(array) {
                for (let i = 0; i < starRes.data.length; i++) {
                    // console.log('i of starRes.data', starRes.data[i].stargazers_count)
                    array.push(starRes.data[i].stargazers_count);
                };
                return arr;
            }
            // console.log('arr', arr)

            
            const arrSum = arr => arr.reduce((a, b) => a + b, 0);
            // arrSum(arr);
            const starCount = stars(arr);
            

            // console.log('stars', arrSum(starCount))

            const profileData = {
                bkgcolor: answer.color,
                imgUrl: res.data.avatar_url,
                name: res.data.name,
                location: res.data.location,
                profile: res.data.html_url,
                blog: res.data.blog,
                bio: res.data.bio,
                repos: res.data.public_repos,
                followers: res.data.followers,
                stars: arrSum(starCount),
                following: res.data.following,
            };
            
            fs.writeFile('template.html', HTML(profileData), err => {
                if (err) console.log(err);

                const template = fs.readFileSync('./template.html', 'utf8');

                pdf.create(template, { format: 'letter' }).toFile(`./${answer.username}_profile.pdf`, (err, res) => {
                    if (err) return console.log(err);
                    console.log(res);
                });
            });
        }).catch(err => {
            console.log(err)
        });
    });
});