const rooms = 
{
    fakeDB : [],
    
    init()
    {

        this.fakeDB.push({image:'images/pic1.jpg',title:'Entire House',description:`Newly Renovated Beautiful 2 Story House
        `,price:`70.99`,rating: 4.3});
    
        this.fakeDB.push({image:'images/pic2.jpg',title:'Condominium',description:`Close to the heart of the city. Cheapest Rate in Downtown`,price:`80.00`, rating:3.0});
    
        this.fakeDB.push({image:'images/pic3.jpg',title:'Townhouse',description:`Executive Condo with 12ft ceiling & Private Entry`,price:`55`, rating: 4.8 });

        this. fakeDB.push({image:'images/pic1.jpg',title:'Condominium',description:`Semi-furnished Condominium Perfect for 5 people`,price:`55`, rating: 3.5 });

        this. fakeDB.push({image:'images/pic2.jpg',title:'Condominium',description:`Semi-furnished Condominium Perfect for 5 people`,price:`55`, rating: 3.5 });

        this. fakeDB.push({image:'images/pic3.jpg',title:'Condominium',description:`Semi-furnished Condominium Perfect for 5 people`,price:`55`, rating: 3.5 });

    },
    getallProducts()
    {
        return this.fakeDB;
    }

}


rooms.init();
module.exports=rooms;
