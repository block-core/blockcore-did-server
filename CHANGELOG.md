## <small>0.0.3 (2022-11-23)</small>

* Ensure that we only copy the release output into image ([5630069](https://github.com/block-core/blockcore-did-server/commit/5630069))
* Update CHANGELOG.md ([f27aed8](https://github.com/block-core/blockcore-did-server/commit/f27aed8))
* Update version ([895891e](https://github.com/block-core/blockcore-did-server/commit/895891e))



## <small>0.0.2 (2022-11-23)</small>

* Feature/workflow (#2) ([19e0217](https://github.com/block-core/blockcore-did-server/commit/19e0217)), closes [#2](https://github.com/block-core/blockcore-did-server/issues/2)
* inputs likely cannot take variables ([09a97b9](https://github.com/block-core/blockcore-did-server/commit/09a97b9))
* Improve the dockerfile processing ([19d063e](https://github.com/block-core/blockcore-did-server/commit/19d063e))
* Update version and changelog ([85e5023](https://github.com/block-core/blockcore-did-server/commit/85e5023))



## <small>0.0.1 (2022-11-22)</small>

* Add "version" script to package ([40e4917](https://github.com/block-core/blockcore-did-server/commit/40e4917))
* Add a date log for updates ([f314d2f](https://github.com/block-core/blockcore-did-server/commit/f314d2f))
* Add a sync class and interval run logic ([e000e74](https://github.com/block-core/blockcore-did-server/commit/e000e74))
* Add basic dockerfile and hosting using Koa ([19d857e](https://github.com/block-core/blockcore-did-server/commit/19d857e))
* Add basic src and init TSConfig ([42cdce0](https://github.com/block-core/blockcore-did-server/commit/42cdce0))
* Add basic sync example (only does first page) ([cf1f38a](https://github.com/block-core/blockcore-did-server/commit/cf1f38a))
* Add basic test setup with ava ([8248172](https://github.com/block-core/blockcore-did-server/commit/8248172))
* Add changelog script ([cd503ed](https://github.com/block-core/blockcore-did-server/commit/cd503ed))
* Add complete verification of initial DID Document creation ([bbd2e51](https://github.com/block-core/blockcore-did-server/commit/bbd2e51))
* Add generated examples output from blockcore-identity repo ([8772842](https://github.com/block-core/blockcore-did-server/commit/8772842))
* Add GitHub workflows ([c03a238](https://github.com/block-core/blockcore-did-server/commit/c03a238))
* Add more test and basic resolve method ([d844d10](https://github.com/block-core/blockcore-did-server/commit/d844d10))
* Add package.json ([96be13f](https://github.com/block-core/blockcore-did-server/commit/96be13f))
* Add proper error handling to the HTTP server returning errors ([39eabc5](https://github.com/block-core/blockcore-did-server/commit/39eabc5))
* Add reading from .env file ([754fbd3](https://github.com/block-core/blockcore-did-server/commit/754fbd3))
* Add some basic project files ([3355788](https://github.com/block-core/blockcore-did-server/commit/3355788))
* Add some basic response handling ([5428036](https://github.com/block-core/blockcore-did-server/commit/5428036))
* Add some instructions on sync model ([f09fc1c](https://github.com/block-core/blockcore-did-server/commit/f09fc1c))
* Add support for creating and resolving DID Documents ([9dbf907](https://github.com/block-core/blockcore-did-server/commit/9dbf907))
* Add support for updating a DID Document ([8016228](https://github.com/block-core/blockcore-did-server/commit/8016228))
* Add support for version queries ([8655417](https://github.com/block-core/blockcore-did-server/commit/8655417))
* Add trim to fix issue with ENV reading of servers ([9336c5a](https://github.com/block-core/blockcore-did-server/commit/9336c5a))
* Add usage of the blockcore typescript config package ([a8fa28f](https://github.com/block-core/blockcore-did-server/commit/a8fa28f))
* Add validation of requets ([3fa2734](https://github.com/block-core/blockcore-did-server/commit/3fa2734))
* Add wipe to clean up storage ([eb5c44a](https://github.com/block-core/blockcore-did-server/commit/eb5c44a))
* Allow serving the VC at the .well-known URL ([a87be36](https://github.com/block-core/blockcore-did-server/commit/a87be36))
* Change some setup and imports to follow modern ESM setup ([d585fc9](https://github.com/block-core/blockcore-did-server/commit/d585fc9))
* Clean the assignment of rate limit ([c44b8d3](https://github.com/block-core/blockcore-did-server/commit/c44b8d3))
* Encapsulate the proof similar to VCs with synthetic proof type "JwtProof2020" ([b62449a](https://github.com/block-core/blockcore-did-server/commit/b62449a))
* Fix import ([6c40c48](https://github.com/block-core/blockcore-did-server/commit/6c40c48))
* Fix the interface for put ([eed822f](https://github.com/block-core/blockcore-did-server/commit/eed822f))
* Fix unit tests ([e5d9e91](https://github.com/block-core/blockcore-did-server/commit/e5d9e91))
* Ignore the built output ([82b8e6a](https://github.com/block-core/blockcore-did-server/commit/82b8e6a))
* Improve handling of delete DID Documents ([8ca3854](https://github.com/block-core/blockcore-did-server/commit/8ca3854))
* Improve the validation of DID Document updates ([d224082](https://github.com/block-core/blockcore-did-server/commit/d224082))
* Initial commit ([03806c8](https://github.com/block-core/blockcore-did-server/commit/03806c8))
* Make the storage more generic by using id instead of did as parameter ([62d925a](https://github.com/block-core/blockcore-did-server/commit/62d925a))
* Remove test that is instead done by blockcore-identity repo ([5a08fe0](https://github.com/block-core/blockcore-did-server/commit/5a08fe0))
* Revert the decision to use DID Subject as primary key ([d5963ef](https://github.com/block-core/blockcore-did-server/commit/d5963ef))
* Reverting decision to allow delete of history ([ea63b3c](https://github.com/block-core/blockcore-did-server/commit/ea63b3c))
* Simplify the not found result logic ([a0a012f](https://github.com/block-core/blockcore-did-server/commit/a0a012f))
* Some changes in usage of keys and sections ([fae66bf](https://github.com/block-core/blockcore-did-server/commit/fae66bf))
* Start implementing the basic server and database for storage ([68eb429](https://github.com/block-core/blockcore-did-server/commit/68eb429))
* Update documentation of DID Server ([726f410](https://github.com/block-core/blockcore-did-server/commit/726f410))
* Update information on delete (we will allow delete of history) ([4be0b34](https://github.com/block-core/blockcore-did-server/commit/4be0b34))
* Update release to publish to Docker Hub ([c0004dc](https://github.com/block-core/blockcore-did-server/commit/c0004dc))
* Use an number based sequence ("seq") for operations log ([2b652ee](https://github.com/block-core/blockcore-did-server/commit/2b652ee))



