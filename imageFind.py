#!/usr/bin/env python
import os,json,sys
from urllib import urlretrieve
import string
import random
from optparse import OptionParser
parser = OptionParser(usage="%prog 'search string' -d")
parser.add_option("-d","--delete",action="store_true",default="False",dest="delete",help="delete after viewing image")
if not len(sys.argv) > 1:
  print 'Please specify search string as first argument'
  sys.exit(0) 

input_string = sys.argv[1]
(options,args) = parser.parse_args()
try:
  search_string = ('+').join(input_string.split())
  # Instead of my-ajax-site.com , please put your own identifier. Google TOS says so.
  json_response =  os.popen("curl -e http://www.my-ajax-site.com 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q="+search_string+"'").read()
  data = json.loads(json_response)
  first_result = str(data["responseData"]["results"][random.randint(0,len(data["responseData"]["results"])-1)]["unescapedUrl"].decode("ascii"))
  image_format = first_result[first_result.find(".",len(first_result)-5,len(first_result)):]
  image_name = '_'.join(input_string.split())  
  image_name += ''.join(random.choice(string.ascii_uppercase + string.digits) for i in xrange(6))
  image_name += image_format
  urlretrieve(first_result,image_name)
  os.popen("open " + image_name) 
  if options.delete == True:
    os.popen("rm " + image_name)
except Exception as e:
  print "One or many things went wrong, let's have some muffins!"


 
