import Debug from 'debug';
import Ollama from '../../providers/Ollama';
import {
  IChatContext,
  IChatRequestMessage,
} from '@/intellichat/types';
import INextChatService from './INextChatService';
import OpenAIChatService from './OpenAIChatService';
import OllamaReader from '@/intellichat/readers/OllamaChatReader';
import { ITool } from '@/intellichat/readers/IChatReader';
import { urlJoin } from '@/common/utils/util';

const debug = Debug('qikonow:intellichat:OllamaChatService');
export default class OllamaChatService
  extends OpenAIChatService
  implements INextChatService {
  constructor(context: IChatContext) {
    super(context);
    this.provider = Ollama;
  }

  protected getReaderType() {
    return OllamaReader;
  }

  protected makeToolMessages(
    tool: ITool,
    toolResult: any,
  ): IChatRequestMessage[] {
    return [
      {
        role: 'assistant',
        tool_calls: [
          {
            id: tool.id,
            type: 'function',
            function: {
              arguments: tool.args, // unlike openai, ollama tool args is not a string
              name: tool.name,
            },
          },
        ],
      },
      {
        role: 'tool',
        name: tool.name,
        content:
          typeof toolResult === 'string' ? toolResult : toolResult.content,
        tool_call_id: tool.id,
      },
    ];
  }

  protected async makeRequest(
    messages: IChatRequestMessage[]
  ): Promise<Response> {
    const payload = await this.makePayload(messages);
    debug('Send Request, payload:\r\n', payload);
    const { base } = this.apiSettings;
    const url = urlJoin('/api/chat', base);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: this.abortController.signal,
    });
    return response;
  }
}
