import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  findAllProducts() {
    return this.productService.findAllProducts();
  }

  @Get(':id')
  findOneProduct(@Param('id') id: number) {
    return this.productService.findProductById(id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.productService.removeProduct(id);
  }

  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productService.createCategory(createCategoryDto);
  }

  @Get('categories')
  findAllCategories() {
    return this.productService.findAllCategories();
  }

  @Get('categories/:id')
  findCategoryById(@Param('id') id: number) {
    return this.productService.findCategoryById(id);
  }

  @Patch('categories/:id')
  updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.productService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: number) {
    return this.productService.removeCategory(id);
  }
}
