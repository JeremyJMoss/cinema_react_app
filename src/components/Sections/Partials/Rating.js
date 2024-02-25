import G from "../../../assets/G.svg";
import PG from "../../../assets/PG.svg";
import M from "../../../assets/M.svg";
import MA from "../../../assets/MA.svg";
import R from "../../../assets/R.svg";

const Rating = ({rating, size}) => {
    let ratingImg;
    let width;

    switch(rating){
        case 'G':
            ratingImg = G;
            break;
        case 'PG':
            ratingImg = PG;
            break;
        case 'M':
            ratingImg = M;
            break;
        case 'MA':
            ratingImg = MA;
            break;
        case 'R':
            ratingImg = R;
            break;
        default:
            break;
    }


    switch(size){
        case 'small':
            width = 'w-7';
            break;
        case 'medium':
            width = 'w-10';
            break;
        case 'large':
            width = 'w-12';
            break;
        default:
            width = 'w-14';
    }

    

    return (
        <img src={ratingImg} alt="" className={width}/>
    )
}

export default Rating