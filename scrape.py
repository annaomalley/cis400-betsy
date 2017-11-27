import sys
import json
import urllib2                 # https://docs.python.org/2/library/urllib2.html
from bs4 import BeautifulSoup  # https://www.crummy.com/software/BeautifulSoup/bs4/doc/
from mongo-tools import get_client, create_collection, insert_collection

# Returns a list of URLs to scrape. File is assumed to be a list of newline seperated URLs
def get_urls_from_file(path):
    fp = open(path, 'r')
    urls = []
    line = fp.readline().strip('\n')
    while line != None and line != '':
        urls.append(line)
        line = fp.readline().strip('\n')
    return urls

# Given a list of urls, return a map from url to page data.
def scrape(urls):
    page_data = {}
    for url in urls:
        req = urllib2.Request(url, headers={'User-Agent':"Magic Browser"})
        con = urllib2.urlopen(req)
        page_data[url] = con.read()
    return page_data

# Given the page data from squawka, parse the relevant information.
def parse_squawka(data):
    # TODO: implement
    pass

# Given a list of JSON objects, push them to the mongo database in the specified collection
def push_to_db(data, uname, password, collection_name):
    client = get_client(uname, password)
    create_collection(client, collection_name)
    for d in data: # each should be a JSON object
        insert_collection(client, collection_name, d)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print 'To run this script, run python scrape.py <file_containing_urls> <mongo username> <mongo password>'
        sys.exit()
    path = sys.argv[1]
    uname = sys.argv[2]
    password = sys.argv[3]
    urls = get_urls_from_file(path)
    data = scrape(urls)
    squawka_data = parse_squawka(data)
    #push_to_db
