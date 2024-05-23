# import os
# import sys
# import pandas as pd

# import requests

# from bs4 import BeautifulSoup


# def scrape_website(url):
#     response = requests.get(url)
#     soup = BeautifulSoup(response.content, "html.parser")
#     return soup


# def get_data(url):
#     data = scrape_website(url)
#     return data


# def parse_soup(soup):
#     div = soup.find("div", {"id": "all_sched"})
#     table = div.find("table")
#     df = pd.read_html(str(table))[0]
#     df = df.dropna(axis=0, subset=["Home", "Away"])
#     df["Wk"] = df["Wk"].astype(int)
#     df["Attendance"] = df["Attendance"].astype(int)
#     df["id"] = df["Wk"].astype(str) + "_" + df["Home"] + "_" + df["Away"]
#     return df


# schedule_url = "https://fbref.com/en/comps/25/schedule/J1-League-Scores-and-Fixtures"
# # schedule_url = (
# #     "https://fbref.com/en/comps/25/2023/schedule/2023-J1-League-Scores-and-Fixtures"
# # )
# schedule = get_data(schedule_url)

# df_scraped = parse_soup(schedule)

# df_stored = pd.read_csv(os.path.join(sys.path[0], "j1-schedule-2024.csv"))
# id_can_edited = df_stored[df_stored["scraped"] == False]["id"].values

# for i, row in df_scraped.iterrows():
#     if row["id"] not in df_stored["id"].values:
#         df_stored = df_stored.append(row)

# df_scraped.to_csv(sys.stdout, index=False)
