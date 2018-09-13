# Section 02: Review On Restful Routing

## Restful Routing
* Given a collection of records on a server, there should be a uniform URL and HTTP request method used to utilize that collection of records.


| URL | METHOD | OPERATION |
| --- | --- | --- |
| `/<name>` | POST | Create a record |
| `/<name>` | GET | Fetch all records |
| `/<name>/:id` | GET | Fetch record with given id |
| `/<name>/:id` | PUT | Update record with given id |
| `/<name>/:id` | DELETE | Delete record with given id |

## shortcoming of restful routing
* restful routing gets complicated when data gets **nested and related**
* sometimes we only need one property of a huge object, getting back the rest of the unneeded is wasteful.

### example: find all friends' companies and positions
if we are trying to find the list of companies and positions of all the friends of a user
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-02%20at%205.19.20%20PM.png)

#### restful method 1: 

![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-02%20at%205.22.36%20PM.png)
downside: too many separate http requests

#### restful method 2:

![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-02%20at%205.24.10%20PM.png)
downside: the endpoint is too customized/particular

#### a method that breaks restful convention
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-02%20at%205.26.46%20PM.png)