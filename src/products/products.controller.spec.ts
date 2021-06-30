import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProductsService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),

    update: jest.fn().mockImplementation((id, dto) => ({
      id: id,
      ...dto,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    })
      .overrideProvider(ProductsService)
      .useValue(mockProductsService)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', () => {
    const dto = { title: 'test title', description: 'test desc' };
    expect(controller.create(dto)).toEqual({
      id: expect.any(Number),
      title: dto.title,
      description: dto.description,
    });

    expect(mockProductsService.create).toHaveBeenCalledWith(dto);
  });

  it('should update a user', () => {
    const dto = { title: 'user update', description: 'desc updated' };

    expect(controller.update('1', dto)).toEqual({
      id: 1,
      ...dto,
    });

    expect(mockProductsService.update).toHaveBeenCalled();
  });
});
