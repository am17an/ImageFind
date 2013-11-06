#!/usr/bin/env python
import os,json
from urllib import urlretrieve

input_string = raw_input("Enter Search String \n")

try:
  search_string = ('+').join(input_string.split())
  json_response =  os.popen("curl -e http://www.my-ajax-site.com 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q="+search_string+"'").read()
  data = json.loads(json_response)
  first_result = str(data["responseData"]["results"][0]["unescapedUrl"].decode("ascii"))
  image_format = first_result[first_result.find(".",len(first_result)-5,len(first_result)):]
  image_name = '_'.join(input_string.split()) + image_format 
  urlretrieve(first_result,image_name)
  os.popen("qlmanage -p " + image_name) 
except Exception as e:
  print "One or many things went wrong, let's have some muffins!"


 
