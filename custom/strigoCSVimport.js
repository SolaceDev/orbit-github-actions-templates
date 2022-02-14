import 'dotenv/config'
import fs from "fs";
import csv from 'csvtojson'


// This script takes in a CSV file as the param
// Add users as members to Orbit
// Create activity for join date in Orbit based on a created_at param
// Make sure you to modify the Tag and Activity Type

function getWorkshopName(file) {
  if (file.toLowerCase().includes("devjam")) {
    return "Dev Jam - Dive into Solace PubSub+"
  }
  if (file.toLowerCase().includes("boomi")) {
    return "Hands-on with Boomi and Solace"
  }
  if (file.toLowerCase().includes("spring") || file.toLowerCase().includes("scst")) {
    return "Spring Cloud Stream & PubSub+ Platform"
  }
  if (file.toLowerCase().includes("rest")) {
    return "How to Event-Enable your REST Architecture with Solace PubSub+"
  }
  if (file.toLowerCase().includes("portal")) {
    return "Creating Event API Products using Event Portal, AsyncAPI & Spring Cloud Stream"
  }
  if (file.toLowerCase().includes("kafka")) {
    return "Hands-on with PubSub+ and Kafka"
  }
}

async function addActivitiesCSV(file, csvUpload) {
  var users = await csv().fromFile(`./strigo/${file}`);
  var workshopName = getWorkshopName(file)
  users.map(user => {
    if (user.Role == "student") {
      var date = new Date(user['Date joined'])
      const content = `${
        user.Name
      },${
        user.Email
      },${
        workshopName
      },Strigo:${
        workshopName
      }, ${
        date.toISOString()
      }\n`

      fs.appendFile(csvUpload, content, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  })
}

async function addMembersCSV(file, csvUpload) {
  var users = await csv().fromFile(`./raw/strigo/${file}`);
  users.map(user => {
    if (user.Role == "student") {
      var content = `${
        user.Name
      },${
        user.Email
      },${
        file.split("_")[0]
      },"Workshop"\n`

      fs.appendFile(csvUpload, content, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  })
}

var strigoCSV = "csvImport/strigo/strigoAttendeesToUploadCSV.csv"
var strigoActivitiesCSV = "csvImport/strigo/strigoActivitiesToUploadCSV.csv"
fs.writeFile(strigoCSV, "name,email,company,tags_to_add\n", err => {})
fs.writeFile(strigoActivitiesCSV, "name,email,title,type,occurred_at\n", err => {})
fs.readdir("./strigo/", (err, files) => {
  files.forEach(file => { // Create CSV files
    addMembersCSV(file, strigoCSV)
    addActivitiesCSV(file, strigoActivitiesCSV)
  });
});
