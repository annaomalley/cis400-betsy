import sys
import json
import string
import pprint
import urllib2                 # https://docs.python.org/2/library/urllib2.

from bs4 import BeautifulSoup  # https://www.crummy.com/software/BeautifulSoup/bs4/doc/
from mongotools import get_client, create_collection, insert_collection
from selenium import webdriver

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
        page_data[url] = str(con.read())
    return page_data

def print_to_file(filename, data):
    f = open('data/'+filename,'w')
    if type(data) is list:
        for d in data:
            f.write(str(d))
    else:
        for d in data.keys():
            f.write(str(data[d]))
    f.close()

# Given a list of JSON objects, push them to the mongo database in the specified collection
def push_to_db(data, uname, password, collection_name):
    client = get_client(uname, password)
    create_collection(client, collection_name)
    for d in data: # each should be a JSON object
        insert_collection(client, collection_name, d)

# Given the page data from squawka, parse the relevant information.
def parse_squawka():
    URL = 'http://www.squawka.com/teams/barcelona/results'
    driver = webdriver.PhantomJS()
    driver.get(URL)
    soup = BeautifulSoup(driver.page_source, 'lxml')
    printable = set(string.printable)
    res = [x for x in soup.find(id="upcoming-fixtures").find_all('tbody')]
    print_to_file('barcelona_games.txt', res)

    #print str([x.find_all('rect').prettify() for x in [soup.find_all('rect')]])
    #pp = pprint.PrettyPrinter()
    #pp.pprint()
    #matches_urls = [str(y)[5:-2] for y in [x.get('fill') for x in soup.find_all('rect') if type(x) != None] if 'url' in str(y)]
    #print str(matches_urls)
    #print str([x[4:-2] in matches_urls])

if __name__ == "__main__":
    squawka_data = parse_squawka()
    #if len(sys.argv) != 4:
    #    print 'To run this script, run python scrape.py <file_containing_urls> <mongo username> <mongo password>'
    #    sys.exit()
    #path = sys.argv[1]
    #uname = sys.argv[2]
    #password = sys.argv[3]
    #urls = get_urls_from_file(path)
    #data = scrape(urls)
    #print_to_file('squawka_data.html', data)
    #push_to_db(squawka_data, uname, password, 'squawka')
