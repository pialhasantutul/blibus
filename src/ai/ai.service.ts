import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProductsService } from '../products/products.service';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(private productsService: ProductsService) {
    this.genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY');
  }

  async chat(userMessage: string): Promise<string> {
    try {
      const products = await this.productsService.findAll();
      const productList = products
        .map((p) => `- ${p.name} | দাম: ${p.price} টাকা | ক্যাটাগরি: ${p.category}`)
        .join('\n');

      const prompt = `তুমি Blibus এর AI shopping assistant "Bli"।
বাংলা ও English দুই ভাষায় কথা বলতে পারো।

আমাদের products:
${productList}

Customer: ${userMessage}`;

      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      return 'দুঃখিত, এই মুহূর্তে AI সেবা উপলব্ধ নেই।';
    }
  }
}