const generatedOtp = ()=>{
    return Math.floor(Math.random() * 900000) + 100000  /// return 6 digits from 100000 to 999999
}
export default generatedOtp 