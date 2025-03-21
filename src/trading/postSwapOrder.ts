import { SwapAdvancedSettings, SwapParameters } from './types'

import { postCoWProtocolTrade } from './postCoWProtocolTrade'
import { getQuoteWithSigner, QuoteResultsWithSigner } from './getQuote'
import { swapParamsToLimitOrderParams } from './utils'
import { OrderBookApi, OrderCreation } from '../order-book'

export async function postSwapOrder(
  params: SwapParameters,
  advancedSettings?: SwapAdvancedSettings,
  orderBookApi?: OrderBookApi,
  preSendHook?: (order: OrderCreation) => Promise<boolean>
) {
  return postSwapOrderFromQuote(await getQuoteWithSigner(params, advancedSettings, orderBookApi), advancedSettings, preSendHook)
}

export async function postSwapOrderFromQuote(
  { orderBookApi, result: { signer, appDataInfo, quoteResponse, tradeParameters } }: QuoteResultsWithSigner,
  advancedSettings?: SwapAdvancedSettings,
  preSendHook?: (order: OrderCreation) => Promise<boolean>
): Promise<string> {
  return postCoWProtocolTrade(
    orderBookApi,
    signer,
    appDataInfo,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    swapParamsToLimitOrderParams(tradeParameters, quoteResponse),
    preSendHook,
    quoteResponse.quote.feeAmount,
    advancedSettings?.quoteRequest?.signingScheme
  )
}
