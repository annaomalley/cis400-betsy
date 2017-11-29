import sys
import json
import pymongo
from pymongo import MongoClient

# Attempt to establish connection with a 5s timeout.
def get_client(uname, password):
    try:
        conn = MongoClient('ds121896.mlab.com', 21896)
        db = conn['betsy-data']
	print '\tattempting to establish connection to client... '
        db.authenticate(uname, password)
        print '\t...connection successful: ' + str(db)
        return db
    except pymongo.errors.ServerSelectionTimeoutError as err:
        print '\t' + 'ERR: Connection timed out. ' + str(err)
        sys.exit(0)

def insert_collection(client, collection_name, record):
    collection = client[collection_name,]
    post_id = collection.insert_one(record).inserted_id
    #print '\t...inserted into collection [' + name + ']: ' + str(post_id)

def create_collection(client, name):
    new_collection = client[name]
    post_id = new_collection.insert_one({"init":1}).inserted_id
    #print '\t...new collection [' + name + ']: ' + str(post_id)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print 'To run this script, run python testscript.py <username> <password>'
        sys.exit()
    client = get_client(sys.argv[1], sys.argv[2])
