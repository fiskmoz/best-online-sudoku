""" Contains static dictionaries loaded from json files """
import os
import json


class CountryDict():
    """ Contains static dictionaries loaded from json files """

    def __init__(self):
        if os.path.isfile("./data/countries.json"):
            with open("./data/countries.json", "r") as countries_json:
                country_dict = json.load(countries_json)
            self.countries = country_dict

    def get_country_by_name(self, country):
        """ see name """
        for country in self.countries:
            if country["name"] == country:
                return country
        return None

    def get_country_by_id(self, country_id):
        """ see name """
        return self.countries[country_id]
