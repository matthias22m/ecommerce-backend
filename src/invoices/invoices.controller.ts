import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
    constructor(private invoicesService: InvoicesService) {}

    @Get(':orderId')
    async getInvoicePdf(@Param('orderId') orderId: string,@Res() response:Response) {
        const invocePath = await this.invoicesService.generateInvoice(parseInt(orderId));
        response.sendFile(invocePath,{root:'.'});
    }
}
