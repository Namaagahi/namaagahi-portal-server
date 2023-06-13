const box = {
    _id: '9874db776b5464309b0dc2cba',
    userId: "646ds335c7459015a1ds3zxw",
    type: {
        name: 'buyShort',
        typeOptions: {
            projCode: 'PR1000',
            brand: 'شهر فرش'
        }
    },
    boxName: 'BX1000',
    duration: {
        startDate: 'Sat May 21 2022 00:00:00 GMT+0430 (Iran Daylight Time)', // 1401/02/31
        endDate: 'Tue Apr 04 2023 00:00:00 GMT+0330 (Iran Standard Time)', // 1402/01/15 
    },
    strucures: ["646ds335c7459015a1ds3zxw","646ds335c7459015a1ds3zxw","646ds335c7459015a1ds3zxw",]
    // duration: 319, // calculateDateDifference function  ((endDateBox - startDateBox) +1) ==> طول دوره 319 روز
    // کد پروژه و برند فقط در باکس های کوتاه مدت وجود دارند. در باکسهای بلند مدت و اونر این دو تا رو نداریم
    // structures: [
    //     {
    //         _id: '64804b004fdf1e7789a721db',
    //         user: "646df86eb5464309b0dc2f2d",
    //         sysCode: "ST1000",
    //         kind: "عرشه پل سواره رو", // سه حالت عرشه پل سواره رو، پل عابر پیاده و بیلبورد داره. بعدا میتونه اضافه بشه. آپشن برای اضافه کردنش بزار
    //         district: 3,
    //         path: "مدرس",
    //         address: "بزرگراه شهید مدرس، تقاطع پل شهید همت، مسیر شمال به جنوب، پل اول",
    //         style: "افقی", // افقی یا عمودی
    //         face: "شمالی", // شمالی، جنوبی، شرقی، غربی
    //         length: 10,
    //         width: 5,
    //         printSize: 50, 
    //         docSize: 45,
    //         isAvailable: true,
    //         history: {
    //             // اطلاعات این قسمت در زمان ایجاد باکس گرفته می شود
    //             buyPlans: [{
    //                 financialYear: 1401,
    //                 // به صورت دیفالت همان تاریخ شروع و پایان باکس است ولی ممکن است سازه در وسط دوره از باکس خارج شود. در این صورت تاریخ پایان باید ویرایش شود
    //                 startDateBuy: 'Sat May 21 2022 00:00:00 GMT+0430 (Iran Daylight Time)', // 1401/02/31
    //                 endDateBuy: 'Sat Mar 11 2023 00:00:00 GMT+0330 (Iran Standard Time)', // 1401/12/20 ==> طول دوره 295 روز
    //                 duration: 295,
    //                 squareCost: 100000,
    //                 monthlyCost: 4500000, // (squareCost * docSize) 
    //                 periodCost: 44250000, // (monthlyCost / 30) * ((endDateBuy - startDateBuy) + 1)
    //                 maintenanceCosts: [
    //                     {
    //                         id: '897df23eb4309546b0dc9e5g',
    //                         contractor: 'میرزایی',
    //                         serviceName: 'رنگ آمیزی',
    //                         // ممکنه پیمانکار روزی در وسط دوره قیمتش رو زیاد کنه. رکوردها باید بر اساس آخرین ایندکس این آرایه محاسبه بشن
    //                         service: [
    //                             {
    //                                 lastDay: 'Sat Nov 05 2022 00:00:00 GMT+0330 (Iran Standard Time)', // 1401/08/14
    //                                 serviceCost: 5000000
    //                             },
    //                             {
    //                                 lastDay: 'Sat Mar 11 2023 00:00:00 GMT+0330 (Iran Standard Time)', // 1401/12/20
    //                                 serviceCost: 8000000 
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         id: '138df14eb3049546b0dc5e2k',
    //                         contractor: 'اداره برق',
    //                         serviceName: 'برق تابلو',
    //                         service: [
    //                             {
    //                                 lastDay: 'Sat Mar 11 2023 00:00:00 GMT+0330 (Iran Standard Time)', // 1401/12/20
    //                                 serviceCost: 4000000 
    //                             }
    //                         ]
    //                     },
    //             ],
    //                 totalCostsPeriod: 56250000, // سرویس کاستهای ایندکس های آخر + periodCost (8000000 + 4000000 + 44250000)
    //                 totalCostMonthly: 5720339 // totalCostPeriod / ((endDateBuy - startDateBuy) + 1)
    //             }],

    //             // این آرایه از پلنهای در وضعیت دان که این سازه در آنها وجود دارد تشکیل می شود
    //             sellPlans: [{
    //                 id:'657df23eb954306b0dc0v7f',
    //                 financialYear: 1401,
    //                 planNo: 'PL1000',
    //                 // این دوره تاریخ حتما باید بین تاریخ پلن خرید سازه در آن سال مالی قرار داشته باشد. 
    //                 startDatePlan: 'Mon May 23 2022 00:00:00 GMT+0430 (Iran Daylight Time)', // 1401/03/02
    //                 endDatePlan : 'Mon Aug 08 2022 00:00:00 GMT+0430 (Iran Daylight Time)', // 1401/05/17
    //                 duration: 78,
    //                 customer: {
    //                     id: '416df14eb4954306b0dc3k2x',
    //                     agentName: 'دولابی',
    //                     companyName: 'دیپوینت',
    //                     role: 'مدیر فروش',
    //                     economyCode: 89543950123,
    //                     registryNum: 9495,
    //                     address: 'تهران، خیابان اول، پلاک دو',
    //                     phone: '0211854578',
    //                     postalCode: 1247896540
    //                 }
    //             }]
    //         }
    //     },
    // ],
}