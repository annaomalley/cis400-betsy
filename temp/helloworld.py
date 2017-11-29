URL = 'http://www.squawka.com/teams/barcelona/stats#performance-score#spanish-la-liga#season-2017/2018#862#all-matches#1-13#by-match'

#from ghost import Ghost
#ghost = Ghost()
#page, resources = ghost.open(URL)
#result, resources = ghost.evaluate("document.getElementsByClassName('inline-text-org');")
#print str(result)

from selenium import webdriver
from bs4 import BeautifulSoup
import time
import string

driver = webdriver.PhantomJS()
driver.get(URL)
soup = BeautifulSoup(driver.page_source, 'lxml')
printable = set(string.printable)
print soup.find(id="slider-blocks").prettify()

f = open('temp/squawka_data.txt','w')
f.write(filter(lambda x: x in printable, soup.prettify()))
f.close()
