import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';
import { fixFileNameEncoding } from './utils/fixFileNameEncoding';

dotenv.config({path: '.env'});

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
});

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, '../dist')));

// Types
interface TelegramRequest {
  message: string;
  channelId: string;
  file?: any;
}

interface TelegramResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface TelegramError {
  error: string;
  details?: string;
}

app.post('/api/send-telegram', upload.single('file'), async (req: Request<{}, TelegramResponse | TelegramError, TelegramRequest>, res: Response<TelegramResponse | TelegramError>) => {
    const { message, channelId } = req.body;
    const file = req.file;

    // Проверяем наличие обязательных параметров
    if (!message || !channelId) {
        return res.status(400).json({ 
            error: 'Missing required parameters: message and channelId' 
        });
    }

    // Получаем токен бота из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
        return res.status(500).json({ 
            error: 'Telegram bot token not configured. Please set TELEGRAM_BOT_TOKEN in .env file' 
        });
    }

    try {
        let response;
        
        if (file) {
            console.log('Sending file to Telegram:', {
                filename: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                bufferLength: file.buffer.length
            });
            
            // Отправляем сообщение с файлом используя встроенный FormData
            const formData = new FormData();

            const fixedFileName = fixFileNameEncoding(file.originalname);
            console.log('Fixed filename:', fixedFileName);
            
            formData.append('chat_id', channelId);
            formData.append('caption', message);
            formData.append('parse_mode', 'HTML');
            formData.append('document', new Blob([file.buffer], { type: file.mimetype }), fixedFileName);

            response = await fetch(
                `https://api.telegram.org/bot${botToken}/sendDocument`,
                {
                    method: 'POST',
                    body: formData
                }
            );
            
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        } else {
            // Отправляем только текстовое сообщение
            response = await fetch(
                `https://api.telegram.org/bot${botToken}/sendMessage`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: channelId,
                        text: message,
                        parse_mode: 'HTML'
                    })
                }
            );
        }

        let data;
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        try {
            data = JSON.parse(responseText);
        } catch (jsonError) {
            console.error('Failed to parse JSON response:', jsonError);
            throw new Error(`Invalid response from Telegram API: ${responseText}`);
        }

        if (!response.ok) {
            console.error('Telegram API error:', data);
            throw new Error(data.description || 'Failed to send message');
        }

        return res.status(200).json({ 
            success: true, 
            message: file ? 'Message with file sent successfully to Telegram' : 'Message sent successfully to Telegram',
            data: data
        });

    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        return res.status(500).json({ 
            error: 'Failed to send message to Telegram',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// // Serve React app
// app.get('*', (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, '../dist', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📱 Telegram integration ready`);
    console.log(`🌐 Open http://localhost:${PORT} to view the app`);
});
