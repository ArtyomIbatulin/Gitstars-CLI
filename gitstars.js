#!/usr/bin/env node
const chalk = require("chalk");
const commander = require("commander");
const mongoose = require("mongoose");
const repoModel = require("./model-repo");
const axios = require("axios");

const DB_URL =
  "mongodb+srv://Artem:starsmdb11%40@cluster0.szgo9gd.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", true);
mongoose.connect(DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const create = async (req, response) => {
  axios({
    method: "get",
    url: "https://api.github.com/search/repositories?q=stars&sort=stars",
  })
    .then((res) => {
      res.data.items.slice(0, 15).map((item) => {
        repoModel.create({
          idRepo: item.id,
          name: item.name,
          owner_login: item.owner.login,
          stargazers_count: item.stargazers_count,
          html_url: item.html_url,
        });
      });
      console.log(chalk.green(`\nData base has updated`));
    })
    .catch((err) => {
      const log = chalk.red(err);
      console.log(log);
    });
};

commander.version("1.0.0").description("CLI git stars.");

commander
  .command("start")
  .alias("s")
  .description("Start create function")
  .action(() => {
    create();
    setInterval(() => create(), 600000);
  });

commander
  .command("all")
  .alias("a")
  .description("Get all repos from db.")
  .action(async (req, res) => {
    try {
      const repos = await repoModel.find();
      console.log(chalk.green(`\nAll repos : \n\n${repos}`));
    } catch (err) {
      console.log(err);
    }
  });

commander
  .command("one <id>")
  .alias("i")
  .description("Get repo by his id from db.")
  .action(async (id, req, res) => {
    try {
      const repo = await repoModel.findOne({ idRepo: `${id}` });

      console.log(chalk.green(`\nRepo by id : \n\n${repo}`));
    } catch (err) {
      console.log(err);
    }
  });

commander
  .command("name <name>")
  .alias("n")
  .description("Get repo by name from db.")
  .action(async (name, req, res) => {
    try {
      const repo = await repoModel.findOne({ name: `${name}` });

      console.log(chalk.green(`\nRepo by name : \n\n${repo}`));
    } catch (err) {
      console.log(err);
    }
  });

commander.parse(process.argv);
