import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) { }

  // create new product
  async insertProduct(title: string, desc: string, price: number): Promise<string> {

    const newProduct = new this.productModel({
      title: title,
      description: desc,
      price: price
    });
    const result = await newProduct.save();

    return result._id as string;
  }

  //get all products data
  async getProducts(): Promise<Product[]> {
    const result = await this.productModel.find().exec();
    // const products = 
    return result.map((p) => ({ id: p._id, title: p.title, description: p.description, price: p.price }));
  }

  async getSingleProduct(productId: string) {
    const product = await this.findProduct(productId);
    return product;
  }

  updateProduct(productId: string, title: string, desc: string, price: number) {
    // const [product, index] = this.findProduct(productId);
    // const updatedProduct = { ...product };
    // if (title) {
    //   updatedProduct.title = title;
    // }
    // if (desc) {
    //   updatedProduct.description = desc;
    // }
    // if (price) {
    //   updatedProduct.price = price;
    // }
    // this.products[index] = updatedProduct;
  }

  deleteProduct(prodId: string) {
    const index = this.findProduct(prodId)[1];
    this.products.splice(index, 1);
  }

  // find a single product
  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id);

    } catch (err) {
      if (!product) {
        throw new NotFoundException("No Product Found")
      }
    }

    return {
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price
    };

  }
}
