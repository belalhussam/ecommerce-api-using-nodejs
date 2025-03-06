class ApiFeatures {
    constructor(mongooseQuery, quertString) {
        this.mongooseQuery = mongooseQuery
        this.quertString = quertString
    }
    filter() {
        const objQuery = { ...this.quertString }
        const existFields = ['page', 'sort', 'limit', 'fields', 'keyword']
        existFields.forEach((field) => delete objQuery[field])
        // filtartion gte lte
        let qeuryStr = JSON.stringify(objQuery)
        qeuryStr = qeuryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        )
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(qeuryStr))
        return this
    }
    sort() {
        if (this.quertString.sort) {
            const soryBy = this.quertString.sort.split(',').join(' ')
            this.mongooseQuery = this.mongooseQuery.sort(soryBy)
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt')
        }
        return this
    }
    paginate(countDocuments) {
        const page = this.quertString.page * 1 || 1
        const limit = this.quertString.limit * 1 || 5
        const skip = (page - 1) * limit
        const endIndex = page * limit
        const pagination = {}
        pagination.currentPage = page
        pagination.limit = limit
        pagination.numberOfPages = Math.ceil(countDocuments / limit)

        // next page
        if (endIndex < countDocuments) {
            pagination.next = page + 1
        }
        if (skip > 0) {
            pagination.prev = page - 1
        }
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)
        this.paginationResult = pagination

        return this
    }
    limitFields() {
        if (this.quertString.fields) {
            const queryFields = this.quertString.fields.split(',').join(' ')
            this.mongooseQuery = this.mongooseQuery.select(queryFields)
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-_v')
        }
        return this
    }
    search(modelName) {
        if (this.quertString.keyword) {
            let query = {}
            if (modelName == 'Product') {
                query.$or = [
                    {
                        title: {
                            $regex: this.quertString.keyword,
                            $options: 'i',
                        },
                    },
                    {
                        description: {
                            $regex: this.quertString.keyword,
                            $options: 'i',
                        },
                    },
                ]
            } else {
                query = {
                    name: { $regex: this.quertString.keyword, $options: 'i' },
                }
            }
            this.mongooseQuery = this.mongooseQuery.find(query)
        }
        return this
    }
}

module.exports = ApiFeatures
