# Custom orbit imports

This directory contains helper scripts to generate csv files from raw exports to Orbit formatted imports. After running the scripts, the import files will be found in the `csvImport` directory

## How to run
1. `npm install`
1. `node <name_of_script>.js`

## LMScsvImport.js

This helper script assumes the following:
1. All Solace Academy users are in a csv file named in `raw/LMS/Solace_Academy_Users.csv`
1. All users courses activities are in a csv file named in `raw/LMS/All_User_Course_Reports.csv`

After running the script, the exported users and activities file are found in the `csvImport/LMS` directory

## strigoCSVimport.js

This helper script assumes the following:
1. All workshop attendees are in a csv file named in `raw/strigo/<NameOfCompany>_<NameOfWorkshop>.csv`

Important note! When exporting the Strigo activities into the `raw/strigo` directory, **RENAME** the file to `<NameOfCompany>_<NameOfWorkshop>.csv`. For example `Solace_DevJam.csv` or `Solace_Boomi.csv`

After running the script, the exported users and activities file are found in the `csvImport/strigo` directory.

Below are the list of workshops that could be used for `<NameOfWorkshop>`
- DevJam
- Boomi
- Spring
- REST
- Portal
- Kafka
