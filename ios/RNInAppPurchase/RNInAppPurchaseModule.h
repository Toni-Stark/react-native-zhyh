//
//  RNInAppPurchaseModule.h
//  XueYue
//
//  Created by Macrow on 2020/4/29.
//  Copyright © 2020 com.zhyh.xueyue. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>
#import <StoreKit/StoreKit.h>

@interface RNInAppPurchaseModule : NSObject <RCTBridgeModule, SKPaymentTransactionObserver, SKProductsRequestDelegate>

@end
