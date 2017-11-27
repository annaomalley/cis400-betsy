import sys
import urllib2                 # https://docs.python.org/2/library/urllib2.html
from bs4 import BeautifulSoup  # https://www.crummy.com/software/BeautifulSoup/bs4/doc/

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

# Given the page data from squawka, parse the relevant information
def parse_squawka(data):
    pass

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print 'To run this script, run python scrape.py <file_containing_urls>'
        sys.exit()
    path = sys.argv[1]
    urls = get_urls_from_file(path)
    scrape(urls)
