<?php

function convertRoutes()
{
    $txt = file_get_contents('../temp/routes.csv');
    $lines = explode("\n", $txt);

    $rs = [];

    foreach ($lines as $key => $value) {
        $details = explode(',', $value);
        $route = $details[0];
        unset($details[0]);
        $str = implode(' ', $details);
        echo $route . '<br>';
        $str = str_replace('`', '', $str);
        $str = str_replace("'", ' ', $str);
        $str = str_replace('"', ' ', $str);
        //echo $str.'<hr>';

        $rs["$route ($str)"] = [];
    }

    file_put_contents('../public/dt/routes.json', json_encode($rs));
}

function convertStreets()
{
    $txt = file_get_contents('../temp/streets.csv');
    $lines = explode("\n", $txt);

    $rs = [];

    foreach ($lines as $key => $value) {
//        $details = explode(',', $value);
//        $route = $details[0];
//        unset($details[0]);
//        $str = implode(' ', $details);
//        echo $route . '<br>';
//        $str = str_replace('`', '', $str);
//        $str = str_replace("'", ' ', $str);
//        $str = str_replace('"', ' ', $str);
        //echo $str.'<hr>';

        $rs["$value"] = [];
    }

    file_put_contents('../public/dt/streets.json', json_encode($rs));
}



function convertStops()
{
    $txt = file_get_contents('../temp/stops.csv');
    $lines = explode("\n", $txt);

    $rs = [];

    foreach ($lines as $key => $value) {
        $value = str_replace('"', ' ', $value);
        $details = explode(',', $value);
        unset($details[0]);
        unset($details[1]);
        unset($details[2]);
        $stop = implode(' ', $details);

        if (count($details) == 8) {
            if (trim($details[3].$details[4]) == trim($details[5].$details[6])) {
                $stop = $details[3] . $details[4];
            } else {
                $stop = $details[3] . $details[4] . $details[5] . $details[6];
            }
            $lt = $details[8];
            $ln = $details[9];
        } else {
            if (trim($details[3]) == trim($details[4])) {
                $stop = $details[3];
            } else {
                $stop = $details[3] . $details[4];
            }
            $lt = $details[6];
            $ln = $details[7];
        }


        echo $stop . '<br>';
        echo $ln . ' ' . $lt . '<br>';
        echo '<hr>';

        $rs["$stop"] = ['lt' => $lt, 'ln' => $ln];
    }

    file_put_contents('../public/dt/stops.json', json_encode($rs));
}

//convertRoutes();
//convertStops();
convertStreets();

