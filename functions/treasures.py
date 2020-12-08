from bs4 import BeautifulSoup as soup
from urllib.request import urlopen as uReq
from urllib.error import HTTPError

def find_synonym(string):
    """ Function to find synonyms for a string"""
    try:
        # Remove whitespace before and after word and use underscore between words
        stripped_string = string.strip()
        fixed_string = stripped_string.replace(" ", "_")
        print(f"{fixed_string}:")

        # Set the url using the amended string
        my_url = f'https://thesaurus.plus/thesaurus/{fixed_string}'
        # Open and read the HTMLz
        uClient = uReq(my_url)
        page_html = uClient.read()
        uClient.close()

        # Parse the html into text
        page_soup = soup(page_html, "html.parser")
        word_boxes = page_soup.find("ul", {"class": "list paper"})
        results = word_boxes.find_all("div", "list_item")

        # Iterate over results and print
        for result in results:
            print(result.text)

    except HTTPError:
        if "_" in fixed_string:
            print("Phrase not found! Please try a different phrase.")

        else:
            print("Word not found! Please try a different word.")


if __name__ == "__main__":
    find_synonym("portfolio")