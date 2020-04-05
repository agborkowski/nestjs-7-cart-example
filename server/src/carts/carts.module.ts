import { Module, HttpModule } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';

@Module({
  imports: [HttpModule],
  controllers: [CartsController],
  providers: [CartsService]
})
export class CartsModule { }
