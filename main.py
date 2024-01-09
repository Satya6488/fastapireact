from fastapi import FastAPI,APIRouter, Form , HTTPException,Depends, Request
from typing import Annotated,List
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import session
from pydantic import BaseModel
from database import SessionLocal,engine
from models import Transaction
from models import Category
from starlette import status
import models 
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()



origins = [
    'http://localhost:3000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

# data base for category
class CategoryBase(BaseModel):
    categorys : str

class CategoryModel(CategoryBase):
    id:int
    class Config:
        from_attributes = True


# database for Transaction
class TransactionBase(BaseModel):
    amount:float
    category : str
    description :str
    is_income:bool
    date :str

class TransactionModel(TransactionBase):
    id:int
    class Config:
        from_attributes = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[session,Depends(get_db)]

models.Base.metadata.create_all(bind=engine)


# Post data to the database
@app.post('/transactions/',response_model=TransactionModel)
async def create_transaction(transaction : TransactionBase,db:db_dependency):
    db_transaction = models.Transaction(**transaction.model_dump())  #line of code to do query in the database
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


# get data from the database
@app.get("/transactions/",response_model=List[TransactionModel])
async def read_transactions(db:db_dependency):
    transactions = db.query(models.Transaction).all()  #line of code to do query in the database
    return transactions

# delete data from the data base
@app.delete("/transactions/{trans_id}")
async def trans_delete(trans_id: int,db: db_dependency ):
    del_trans=db.query(Transaction).filter(Transaction.id == trans_id).first()
    db.delete(del_trans)
    db.commit()
    return {"message": "Item deleted successfully"}

# Update data in the DataBase
    
@app.put("/transactions/{trans_id}")
async def trans_update(trans_id: int,trans_request:TransactionBase, db: db_dependency ):
    db_item=db.query(Transaction).filter(Transaction.id == trans_id).first()
    db_item.amount=trans_request.amount
    db_item.category = trans_request.category
    db_item.description = trans_request.description
    db_item.is_income = trans_request.is_income
    db_item.date = trans_request.date
    db.commit()
    return {"message": "Item updated successfully"}


# setting up the api end piont for the category
# add category
@app.post('/categorydatas/',response_model=CategoryModel)
async def get_category(categorydata:CategoryBase,db:db_dependency):
    db_category = models.Category(**categorydata.model_dump())  #line of code to do query in the database
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# get category
@app.get('/getcategory',response_model=List[CategoryModel])
async def get_category(db:db_dependency):
    response =db.query(models.Category).all() 
    return response

# delete category
@app.delete('/delete_category/{cate_id}')
async def delete_category(cate_id :int ,db :db_dependency):
    delete_cate = db.query(models.Category).filter(cate_id == Category.id).first()
    db.delete(delete_cate)
    db.commit()
    return {"msg":"utem delete successfully"}

 











    















