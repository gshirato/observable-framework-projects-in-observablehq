import os
import sys
import pandas as pd


def parse_date(df):
    res = df.copy()
    res["date"] = pd.to_datetime(res["年月日"])
    res["year"] = res["date"].dt.year
    res["month"] = res["date"].dt.month
    res["day"] = res["date"].dt.day
    res["weekday"] = res["date"].dt.weekday.map(
        {0: "月", 1: "火", 2: "水", 3: "木", 4: "金", 5: "土", 6: "日"}
    )
    return res


def parse_audience(df):
    res = df.copy()
    res["観客数"] = res["観客数"].map(
        lambda x: {"無観客試合": 0, "-": 0}[x] if x in ["無観客試合", "-"] else x
    )
    res["観客数"] = res["観客数"].map(
        lambda x: (
            int(x.replace("人", "").replace(",", "").replace("約", ""))
            if type(x) is str
            else x
        )
    )
    return res


def get_result(df):
    df["result"] = df["スコア"].map(
        lambda x: (
            "W" if x[0] == "○" else "D" if x[0] == "△" else "L" if x[0] == "●" else None
        )
    )
    df["得点"] = df["得点"].map(lambda x: x if x.isdecimal() else -1).astype(int)
    df["失点"] = df["失点"].map(lambda x: x if x.isdecimal() else -1).astype(int)
    df["result_before_shootout"] = (df["得点"] - df["失点"]).map(
        lambda x: "W" if x > 0 else "D" if x == 0 else "L" if x < 0 else None
    )
    df["延期or中止"] = df["得点"] == -1
    df["result"] = df["result"].fillna(df["result_before_shootout"])

    del df["result_before_shootout"]

    return df


df = pd.read_csv(os.path.join(sys.path[0], "urawa-all-games-20240223.csv"))
df = parse_date(df)
df = parse_audience(df)
df = get_result(df)
df.to_csv(sys.stdout, index=False)
