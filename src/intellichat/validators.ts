import { captureException } from '@/common/utils/logging';
import { isNull, isNumber } from 'lodash';
import { isBlank } from '@/common/utils/validators';
import { ProviderType } from '@/providers/types';
import { getChatModel, getProvider } from '@/providers';

const DEFAULT_MAX_TOKEN = 4096;

export function isValidMaxTokens(
  maxTokens: number | null | undefined,
  providerName: ProviderType,
  modelName: string
): maxTokens is number | null {
  if (maxTokens === null || maxTokens === undefined) return true;
  if (!isNumber(maxTokens)) return false;
  if (maxTokens <= 0) return false;

  const model = getChatModel(providerName, modelName);
  return maxTokens <= (model.maxTokens || DEFAULT_MAX_TOKEN);
}

export function isValidTemperature(
  temperature: number | null | undefined,
  providerName: ProviderType
): boolean {
  if (isBlank(providerName)) {
    return false;
  }
  if (!isNumber(temperature)) {
    return false;
  }
  const provider = getProvider(providerName);
  const { min, max, interval } = provider.chat.temperature;
  if (temperature === null || temperature === undefined) {
    return false;
  }
  if (interval?.leftOpen ? temperature <= min : temperature < min) {
    return false;
  }
  if (interval?.rightOpen ? temperature >= max : temperature > max) {
    return false;
  }
  return true;
}
