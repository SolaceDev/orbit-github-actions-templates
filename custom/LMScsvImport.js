import 'dotenv/config'
import fs from "fs";
import csv from 'csvtojson'

// This script takes in raw csv file for users and activities in LMS
// Creates a csv import file for orbit members
// Creates a csv import file for orbit join activities
// Creates a csv import file for orbit courses activities

function getCompany(user) {
  return user.Company.includes(",") ? user.Company.split(",").join(" ") : user.Company
}

// Sanitizing country name
function getCountry(user) {
  if (user['My Country'].includes(",")) {
    var components = user['My Country'].split(",")
    return components[1] + " " + components[0]
  } else {
    return user['My Country']
  }
}

// Sanitizing user role
function getRole(user) {
  return user.Role.includes(",") ? user.Role.split(",").join(" ") : user.Role
}

// Sanitizing First and Last name
function getName(user) {
  if (user['First Name'].includes(",")) {
    return user['First Name'].split(",").join(" ") + " " + user['Last Name']
  } else {
    return user['First Name'] + " " + user['Last Name']
  }
}

// Create a members CSV import file
function addMembersCSV(users, csvUpload) {
  users.map(user => {
    if (!user.Email.includes("solace")) {
      const content = `${
        getName(user) ? getName(user) : ""
      },${
        getRole(user) ? getRole(user) : ""
      },${
        getCompany(user) ? getCompany(user) : ""
      },${
        user.Email
      },${
        getCountry(user) ? getCountry(user) : ""
      },"Training"\n`

      fs.appendFile(csvUpload, content, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  })
}

// Create a join date activity CSV import file
function addJoinActivityCSV(users, csvUpload) {
  users.map(user => {

    if (!user.Email.includes("solace")) {
      var date = new Date(user['User Creation Date'])
      const content = `${
        getName(user) ? getName(user) : null
      },${
        user.Email
      },Joined LMS,LMS:JoinDate, ${
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

// Create a courses completed activity CSV import file
function addCourseActivitiesCSV(users, csvUpload) {
  const certificationExams = ["Solace Certified Event Driven Architecture Practitioner Exam", "Solace Certified Solutions Consultant Exam", "Solace Certified Developer Practitioner Level 1 Exam"]
  users.map(user => {
    if (!user.Email.includes("solace") && certificationExams.includes(user["Course Name"]) && user['Completion Date'] != "") {
      var date = new Date(user['Completion Date'])
      const content = `${
        user.Email
      },${
        user["Course Name"]
      },LMS:${
        user["Course Name"]
      }, ${
        date.toISOString()
      },"Certified"\n`

      fs.appendFile(csvUpload, content, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  })
}

// Read in the Users and Courses csv file
const users = await csv().fromFile("./raw/LMS/Solace_Academy_Users.csv");
const courseActivities = await csv().fromFile("./raw/LMS/All_User_Course_Reports.csv");

// Prepare CSV file for import
const usersCSV = "csvImport/lms/usersToUpload.csv"
const joinActivitiesCSV = "csvImport/lms/joinActivitiesToUpload.csv"
const courseActivitiesCSV = "csvImport/lms/courseActivitiesToUpload.csv"

fs.writeFile(usersCSV, "name,title,company,email,location,tags_to_add\n", err => {})
fs.writeFile(joinActivitiesCSV, "name,email,title,type,occurred_at\n", err => {})
fs.writeFile(courseActivitiesCSV, "email,title,type,occurred_at,member_tags_to_add\n", err => {})

// Write to files
addMembersCSV(users, usersCSV)
addJoinActivityCSV(users, joinActivitiesCSV)
addCourseActivitiesCSV(courseActivities, courseActivitiesCSV)
