import sys
import pymongo
from pymongo import MongoClient

USER = 'test'
PWD = 'testpassword'
PORT = '27017'
HOST_PUB_IP = '54.172.179.228' #HOST_PRIV_IP = '172-31-49-21'
HOST = 'mongodb://'+USER+':'+PWD+'@'+HOST_PUB_IP+':'+PORT

# Attempt to establish connection with a 3s timeout.
def get_client(host):
    try:
        CLIENT = MongoClient(host, serverSelectionTimeoutMS=3000, connectTimeoutMS=20000)
        print '\t' + 'attempting to establish connection to client:'
        print '\t' + str('host: ' + HOST)
        CLIENT.server_info()
        return CLIENT
    except pymongo.errors.ServerSelectionTimeoutError as err:
        print '\t' + 'ERR: Connection timed out. ' + str(err)
        sys.exit(0)

CLIENT = get_client(HOST)
CLIENT.close()
