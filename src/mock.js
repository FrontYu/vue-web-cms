const Mock = require('mockjs')

Mock.setup({
    timeout: 200
})

Mock.mock('/merchant/sms/code',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/sms/login',{
  code: 0,
  data: {
    user_type: 1
  }
})

Mock.mock('/merchant/logout',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/register',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/settings',{
  code: 0,
  data: {
    name: "@name",
    phone: "13512345678",
    photo: "@IMAGE"
  }
})

Mock.mock('/merchant/profile',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/file_url',{
  code: 0,
  data: {
    file_url: "https://whoot.ingstatics.cn/upload/@guid()/9942b5119afd838607144bf719cb3888.jpg"
  }
})
// head img
Mock.mock(/\.jpg/,{
  code: 0,
  data: {}
})

Mock.mock('/merchant/file_upload', (req, res) => {
  console.log(req)
  return {
    code: 0,
    data: {

    }
  }
})

Mock.mock('/merchant/home',{
  code: 0,
  data: {
    merchant: {
      email: "@email",
      "language|1": ["zh-CN", "zh-HK", "en-US"],
      name: "@name",
      photo: "@IMAGE",
      phone: "+86-13512345678"
    },
    "locations|5-12": [
      {
        "id|10001-99999": 10001,
        name: "@title",
        photo: "@IMAGE",
        "staffs|1-100": 1
      }
    ]
  }
})

Mock.mock('/merchant/location/get',{
  code: 0,
  data: {
    location: {
      "id|10001-99999": 10001,
      name: "@name",
      address: "@csentence",
      'region|1-20': 1,
      'category|1-3': 1,
      latitude: 22.3892812,
      longitude: 113.9710404,
      phone: "0755-87123456",
      photo: "@IMAGE",
      time_zone: 480,
      rate: 3.5,
      "rate1_nums|1-99": 1,
      "rate2_nums|1-99": 2,
      "rate3_nums|1-99": 3,
      "rate4_nums|1-99": 4,
      "rate5_nums|1-99": 5,
      "rate_total_nums|100-999": 15,
      "currency|1": ["HKD", "MOP", "TWD", "CNY", "JPY", "PHP", "RM", "SGD", "INR", "EUR", "ISK", "DKK", "SUR", "GBP", "FRF", "ESP", "CAD", "USD", "AUD"],
      "price|100-999": 100,
      "dishes|3-6": [
        {
          "id|10001-99999": 10001,
          name: "@name",
          desc: "@cparagraph",
          photo: "@IMAGE",
          "price": "@float(1, 1000, 0, 2)",
          "currency|1": ["HKD", "MOP", "TWD", "CNY", "JPY", "PHP", "RM", "SGD", "INR", "EUR", "ISK", "DKK", "SUR", "GBP", "FRF", "ESP", "CAD", "USD", "AUD"],
          "like_amount|1-999": 100,
          "is_top_dish|1": true
        }
      ],
      "banners|4-6": [{"photo": "@IMAGE"}],
      "coupons|10-20": [
        {
          "id|10001-99999": 10001,
          name: "@name",
          "grade|1-4": 1,
          photo: "@IMAGE",
          "coupons|1-3": 1,
          "restriction|1-3": 1,
          count_redemption: 2,
          "total_redemption|1-100": 10,
          start_date: "2017-11-23",
          expiration_date: "2019-11-23",
          opening: "08:00:00.123456",
          closing: "18:00:00.123456"
        }
      ],
      "comments|2-4": [
        {
          "id|1-99999": 1,
          guest_name: "@name",
          guest_photo: "@IMAGE",
          "rate|0-5": 4,
          comment: "@cparagraph",
          "comment_images|3-6": [
            {
              photo: "@IMAGE"
            }
          ],
          comment_at: "2017-10-11 03:33:03.979541+00:00",
          reply: "@cparagraph",
          reply_at: "2017-10-11 03:35:03.979541+00:00"
        }
      ]
    }
  }
})

Mock.mock('/merchant/location/update',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/location/create',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/staffs',{
  code: 0,
  data: {
    "staffs|3-5": [
      {
        "id|10001-99999": 1,
        name: "@name",
        "grade|0-1": 1,
        // "nation_code|1": ["86", "852"],
        phone: "+86-13512345678",
        email: "@email",
        photo: "@IMAGE"
      }
    ]
  }
})

Mock.mock('/merchant/staff/update',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/staff/new',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/staff/delete',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/dish/create',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/dish/update',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/dish/delete',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/coupons',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/coupon/create',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/coupon/update',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/coupon/delete',{
  code: 0,
  data: {}
})

Mock.mock('/merchant/coupon/use',{
  code: 0,
  data: {
    coupon: {
      "id|1-999": 1,
      sn: "123456789012345",
      "grade|1-4": 1,
      expired_at: "2017-10-11 03:35:03.979541+00:00",
      "guest_name": "@name",
      "coupons|1-3": 1,
      "dish_name": "@name",
      used_at: "2017-10-11 03:35:03.979541+00:00"
    }
  }
})

Mock.mock('/merchant/location/comments',{
  code: 0,
  data: {
    "comments|4-5": [
      {
        "id|+1": 1,
        guest_name: "@name",
        guest_photo: "@IMAGE",
        "rate|0-4": 4,
        comment: "@cparagraph",
        "comment_images|3-6": [
          {
            photo: "@IMAGE"
          }
        ],
        comment_at: "2017-10-11 03:33:03.979541+00:00",
        reply_name: "@name",
        "reply|0-1": "@cparagraph",
        reply_at: "2017-10-11 03:35:03.979541+00:00"
      }
    ]
  }
})

Mock.mock('/merchant/comment/reply',{
  code: 0,
  data: {}
})

Mock.mock('http://dummyimage_s.com/*', 'get', {
  code: 0,
  data: {}
})