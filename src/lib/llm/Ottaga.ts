import { OttagaHealthConfig, OttagaSafeGuardConfig } from '../../../llm.config';
import { OttagaOpenAIProvider } from './providers/OttagaOpenAIProvider';
import { OttagaSafeGuard } from './ottageSafeGuard/OttagaSafeGuard';
import { OttagaHealth } from './ottagaHealth/OttagaHealth';

const healthInstanceLLM = new OttagaOpenAIProvider(OttagaHealthConfig)
export const OttagaHealthLLM = new OttagaHealth(healthInstanceLLM);

const safeGuardInstanceLLM = new OttagaOpenAIProvider(OttagaSafeGuardConfig)
export const OttagaSafeGuardLLM = new OttagaSafeGuard(safeGuardInstanceLLM);

