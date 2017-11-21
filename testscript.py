import pymongo
from pymongo import MongoClient

HOST = 'ec2-54-172-179-228.compute-1.amazonaws.com'
PORT = 27017
CLIENT = MongoClient(HOST, PORT)
