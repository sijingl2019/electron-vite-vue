import { ProviderType, IChatModel, IServiceProvider } from '@/providers/types';
import OpenAI from './OpenAI';
import Grok from './Grok';
import DeepSeek from './DeepSeek';
import Ollama from './Ollama';
import Doubao from './Doubao';
import { merge } from 'lodash';

export const providers: { [key: string]: IServiceProvider } = {
  OpenAI,
  Grok,
  Ollama,
  Doubao,
  DeepSeek,
};

export function getProvider(providerName: ProviderType): IServiceProvider {
  return providers[providerName];
}

export function getChatModel(
  providerName: ProviderType,
  modelName: string
): IChatModel {
  const provider = getProvider(providerName);
  if(Object.keys(provider.chat.models).length===0){
    return {} as IChatModel;
  }
  const model = provider.chat.models[modelName];
  return model||{} as IChatModel;
}

export function getGroupedChatModelNames(): { [key: string]: string[] } {
  const group = (models: IChatModel[]) =>
    models.reduce((acc: { [key: string]: string[] }, cur: IChatModel) => {
      if (acc[cur.group]) {
        acc[cur.group].push(cur.name || '');
      } else {
        acc[cur.group] = [cur.name || ''];
      }
      return acc;
    }, {});
  const models = Object.values(providers).map((provider: IServiceProvider) =>
    group(Object.values(provider.chat.models))
  );
  const result={}
  merge(result,...models)
  return result
}
