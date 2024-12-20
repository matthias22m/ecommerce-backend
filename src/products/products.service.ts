import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/products.entity';
import { Not, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { privateDecrypt } from 'crypto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepositary: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepositary: Repository<Category>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, ...rest } = createProductDto;
    const category = await this.categoryRepositary.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category Not Found.');
    }
    const product = this.productRepositary.create({ ...rest, category });

    return this.productRepositary.save(product);
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productRepositary.find({ relations: ['category'] });
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.productRepositary.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException('Product Not Found.');
    }
    return product;
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findProductById(id);
    const { categoryId, ...rest } = updateProductDto;

    if (categoryId) {
      const category = await this.categoryRepositary.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category Not Found.');
      }
      product.category = category;
    }

    Object.assign(product, rest);

    return this.productRepositary.save(product);
  }

  async removeProduct(id: number): Promise<void> {
    const product = await this.findProductById(id);
    product.category = null;
    await this.productRepositary.remove(product);
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepositary.create(createCategoryDto);
    return this.categoryRepositary.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    return await this.categoryRepositary.find({ relations: ['products'] });
  }

  async findCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepositary.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Category Not Found.');
    }
    return category;
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findCategoryById(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepositary.save(category);
  }

  async removeCategory(id: number): Promise<void> {
    const category = await this.findCategoryById(id);
    if (category.products && category.products.length > 0) {
      for (const product of category.products) {
        product.category = null;
        await this.productRepositary.save(product)
        console.log(product)
      }
    }
    await this.categoryRepositary.remove(category);
  }
}
