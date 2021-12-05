import { CompilationServiceImpl } from './compilation-service';
import 'reflect-metadata';

describe('CompilationServiceImpl', () => {

    let compilationServiceImpl: CompilationServiceImpl;

    beforeEach(async () => {
        compilationServiceImpl = new CompilationServiceImpl();
    });

    it('should log three strings in console', async () => {
        try { await compilationServiceImpl.compile("arduino:avr:circuitplay32u4cat", "aa8083dd-4f36-4eeb-8fa3-9ac3c867f55e", "C:\\Users\\kevin\\Documents\\Arduino\\Light_Project_1")
    } catch (err){
        console.error(err)
    }
        expect(true).toBe(false)
    }, 15000);
});