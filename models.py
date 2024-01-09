# creating table

from database import Base
from sqlalchemy import Column,Integer,String,Boolean,Float

class Transaction(Base):
    __tablename__ = 'transaction'
    id = Column(Integer,primary_key=True,index=True)
    amount=Column(Float)
    category = Column(String)
    description =Column(String)
    is_income = Column(Boolean)
    date =Column(String)
    
class Category(Base):
    __tablename__ = 'categorydata'
    id = Column(Integer,primary_key=True,index=True)
    categorys = Column(String)
