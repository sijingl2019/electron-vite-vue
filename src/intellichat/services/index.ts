import { IChatContext } from '../types';
import { ProviderType } from '../../providers/types';
import OllamaChatService from './OllamaChatService';
import OpenAIChatService from './OpenAIChatService';
import DoubaoChatService from './DoubaoChatService';
import GrokChatService from './GrokChatService';
import DeepSeekChatService from './DeepSeekChatService';
import INextChatService from './INextChatService';

export default function createService(
  providerName: ProviderType,
  chatCtx: IChatContext
): INextChatService {
  switch (providerName) {
    case 'OpenAI':
      return new OpenAIChatService(chatCtx);
    case 'Ollama':
      return new OllamaChatService(chatCtx);
    case 'Doubao':
      return new DoubaoChatService(chatCtx);
    case 'Grok':
      return new GrokChatService(chatCtx);
    case 'DeepSeek':
      return new DeepSeekChatService(chatCtx);
    default:
      throw new Error(`Invalid provider:${providerName}`);
  }
}
