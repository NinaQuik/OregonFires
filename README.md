# Oregon Fire Analysis and Prediction (1992-2015)
## Backround
As data analysts we want to use our skills to help our local and global communities, so for this project we wanted to explore an issue regarding climate-change. As Oregonians the issue of wildfires is of recurring relevance to our lives. After decades of ever-more frequent wildfires Oregon saw its worst fire season in 2021. With average temperatures continuing to rise locally and around the globe, the situation shows no signs of slowing. We discovered a great dataset with which to explore this topic. This data is from Kaggle and includes an SQLite file and various CSV files containing data about 1.88 million US wildfires over 23 years.

Questions we hope to answer in the coming weeks:

• Have wildfires in Oregon increased in frequency?

• Have Oregon wildfires increased in size over time?

• Has Oregon wildfire season changed over time?

• Using machine-learning can we predict how wildfires may change in the next 5 years?

• Can we determine which areas of the State are of higher-risk?

## Plan
We will communicate primarily through Slack over the next few weeks, with check-ins on Saturdays and Sundays, as well as during class time. For the first segment Nina explored the raw data and cleaned it up for use. Alex explored possible machine learning options. Jovan created the repository and documented the process.

## Data Cleaning
After importing libraries and the SQLite file into Jupyter Notebook, and creating an engine to talk to the database we performed the following steps:

1. Inspected the names of the tables and printed the columns to see what data we have to work with.

2. Filtered the data to show only fire data from Oregon. This left us with 61,088 rows of data.

3. Determined what the data types in the columns are.

4. Created a dataframe of Oregon fires with only the columns relevant to our inquiry.

5. Checked the counts of the columns to see if any have missing data, then dropped those rows. This left us with 60,751 rows of data.

6. Explored the value counts of the column containing causes of fires in Oregon.

7. Explored the value counts of the column containing counties where fires are reported.

8. Converted Julian version of discover dates and containment dates into a readable format, and dropped the Julian versions from the dataframe.

9. Calculated the number of days each fire burned for.

## Machine Learning

Once the data has been cleaned, machine learning models can be run on some of the catergorical data and numerical data. 

Our finalized columns include fire_size, fire_size_class, latitude, longitude, fire_year, discovery_doy, cont_doy, stat_cause_code, stat_cause_descr, county_code, county_name, discovery_date, containment_date, duration.

The numerical columns relevant for the machine learning to be used will be fire_size, fire_year (count unique), county_name (count unique), and duration. The catergorical columns relevant for ML are fire_class and stat_cause_describe.

1. Import the following: 

    • import numpy as np
    • import seaborn as sns
    • import matplotlib.pyplot as plt
    • %matplotlib inline 
    • sklearn.model_selection import train_test_split
    • sklearn.metrics import accuracy_score, classification_report
    • sklearn.ensemble import RandomForestRegressor

2. Use the describe functiion to get stats for numerical columns.

3. View each column as a line graph to look for any apparent trends in the data.

4. Drop columns that are irrelevant.

5. Bin catergorical data: fire_class and stat_cause_describe.

6. Figure out target variable. This will be done for each of our target variables, so this method will be repeated for each of the following: 

    • fire_size by year
    • fire_class by year
    • fire_duration (count unqiue) in days by year 
    • stat_cause_describe by year
    • county_code by year
    • start_date (earliest in season) by year
    • containment_date (lastest in season) by year

For each model, separate out the target variable.

7. Train and test the data sets using train_test_split. 
8. Use the RandomForestRegressor model to test the data.
9. Fit the model.
10. Check for accuracy.

Notes for next week: Because the data only goes through 2017, we can use the models to make predictions into the future and test it's accuracy using more recent data. The goal is to project these data into future years to get an understanding of fire behavior in Oregon and what we might expect in the upcoming years. One thought was to include air quality data, which affects us across the state, and may help determine areas of refuge for people during the fire season. I will look to see if we have any data for that as well. 

## Database
We will be using postgresql running in AWS RDS.

Here is the ERD containing the graphical representation of table relationships:

![ERD](/Resources/ERD.png)

We are exploring also using air quality data.  If chosen, additional tables will be created and added to the database.

## Presentation
Our presentation will likely contain the following:

• Plot of fire frequency

• Plot of fire size

• Plot of fire season

• Plots of 2027 predictions

• Plot of high-risk areas

• The results of our machine learning tests

Team: Alex Dallman, Jovan Humphrey, Nina Q

Source: https://www.kaggle.com/datasets/rtatman/188-million-us-wildfires
